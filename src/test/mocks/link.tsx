// __mocks__/next/link.tsx
// Typed manual mock for next/link that renders as a plain <a> and strips Next-only props.

import * as React from "react";

type HrefLike = string | { pathname?: string };

type LinkProps = {
  href: HrefLike;
  children?: React.ReactNode;

  // Next-only props that must NOT reach the DOM:
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

function toUrl(href: HrefLike): string {
  return typeof href === "string" ? href : href?.pathname ?? "/";
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, ...rest },
  ref
) {
  const {
    prefetch,
    replace,
    scroll,
    shallow,
    passHref,
    locale,
    legacyBehavior,
    ...anchorProps
  } = rest;

  return (
    <a href={toUrl(href)} ref={ref} {...anchorProps}>
      {children}
    </a>
  );
});

export default Link;
