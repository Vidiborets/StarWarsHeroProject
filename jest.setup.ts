// jest.setup.ts
// This file runs in Jest's environment before each test file

import "@testing-library/jest-dom";
import type { ReactElement, ReactNode } from "react";
import React from "react";

/* --------------------------- next/link mock (typed) -------------------------- */

type HrefLike = string | { pathname?: string };

type NextLinkLikeProps = {
  href: HrefLike;
  children?: ReactNode;
  // next/link known props we want to ignore in the DOM:
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

// Helper to get URL string from next/link href variants.
function hrefToString(href: HrefLike): string {
  if (typeof href === "string") return href;
  return href?.pathname ?? "/";
}

// Helper to drop Next-only props so React doesn't warn about non-boolean attrs
function stripNextOnlyProps(
  props: NextLinkLikeProps
): React.AnchorHTMLAttributes<HTMLAnchorElement> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    prefetch,
    replace,
    scroll,
    shallow,
    passHref,
    locale,
    legacyBehavior,
    href: _ignored,
    ...anchorRest
  } = props;
  return anchorRest;
}

jest.mock("next/link", () => {
  // Use require for runtime import while keeping types via typeof
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React: typeof import("react") = require("react");

  const Link = React.forwardRef<HTMLAnchorElement, NextLinkLikeProps>(
    function Link({ href, children, ...rest }, ref): ReactElement {
      const url = hrefToString(href);
      const anchorProps = stripNextOnlyProps({ href, children, ...rest });
      return React.createElement(
        "a",
        { href: url, ref, ...anchorProps },
        children
      );
    }
  );

  return { __esModule: true, default: Link };
});

/* --------------------------- next/image mock (typed) ------------------------- */

jest.mock("next/image", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React: typeof import("react") = require("react");
  return function MockedNextImage(
    props: React.ImgHTMLAttributes<HTMLImageElement>
  ): ReactElement {
    const { src, alt, ...rest } = props;
    // Render as a plain <img> to keep Testing Library queries simple
    return React.createElement("img", { src, alt, ...rest });
  };
});

// Mock LazyImage so that wrapper-only props never reach the DOM.
jest.mock("@/components/LazyImage", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react") as typeof import("react");

  type LazyImageProps = {
    alt: string;
    src: string;
    className?: string;
    // this prop must NOT be forwarded to the DOM:
    wrapperClassName?: string;
  } & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "alt" | "src">;

  // eslint-disable-next-line react/display-name
  const Mock = React.forwardRef<HTMLImageElement, LazyImageProps>(
    ({ alt, src, wrapperClassName: _omit, ...rest }, ref) =>
      React.createElement("img", { alt, src, ref, ...rest })
  );

  return { __esModule: true, default: Mock };
});

// Minimal, typed mock for IntersectionObserver
type IOCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  private _callback: IOCallback;
  private _targets: Element[] = [];

  constructor(callback: IOCallback, options?: IntersectionObserverInit) {
    this._callback = callback;
    this.rootMargin = options?.rootMargin ?? "";
    const t = options?.threshold;
    this.thresholds = Array.isArray(t) ? t : t != null ? [t] : [0];
    __ioInstances.add(this);
  }

  observe = (target: Element): void => {
    this._targets.push(target);
  };

  unobserve = (target: Element): void => {
    this._targets = this._targets.filter((el) => el !== target);
  };

  disconnect = (): void => {
    this._targets = [];
    __ioInstances.delete(this);
  };

  takeRecords = (): IntersectionObserverEntry[] => [];

  _trigger(isIntersecting: boolean): void {
    const target =
      this._targets[0] ?? (document.createElement("div") as Element);
    const entry: IntersectionObserverEntry = {
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      target,
      time: Date.now(),
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
    };
    React.act(() => {
      this._callback([entry], this);
    });
  }
}

const __ioInstances = new Set<MockIntersectionObserver>();

// Подменяем глобальный IO
global.IntersectionObserver = MockIntersectionObserver;

export function triggerInView(isIntersecting: boolean): void {
  React.act(() => {
    __ioInstances.forEach((io) => io._trigger(isIntersecting));
  });
}
