/* eslint-disable @next/next/no-img-element */
"use client";
import { useLayoutEffect, useRef, useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
};

export default function LazyImage({
  wrapperClassName = "",
  className = "",
  src,
  alt = "",
  onLoad,
  onError,
  ...rest
}: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const reveal = () => {
    setIsVisible(true);
    window.setTimeout(() => setShowSkeleton(false), 120);
  };

  const setImgRef = (el: HTMLImageElement | null) => {
    imgRef.current = el;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      setIsVisible(true);
      setShowSkeleton(false);
    } else {
      setIsVisible(false);
      setShowSkeleton(true);
    }
  };

  useLayoutEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    if (el.src !== (src ?? "")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(false);
      setShowSkeleton(true);
    } else if (el.complete && el.naturalWidth > 0) {
      // тот же src и он уже в кеше
      setIsVisible(true);
      setShowSkeleton(false);
    }
  }, [src]);

  async function handleLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const el = e.currentTarget;
    try {
      if ("decode" in el) {
        await (el as HTMLImageElement).decode?.();
      }
    } catch {}
    reveal();
    onLoad?.(e);
  }

  function handleError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    onError?.(e);
  }

  return (
    <div className={`relative ${wrapperClassName}`}>
      {showSkeleton && (
        <div className="absolute inset-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 pointer-events-none" />
      )}
      <img
        ref={setImgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={handleLoad}
        onError={handleError}
        className={[
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
          className,
        ].join(" ")}
        {...rest}
      />
    </div>
  );
}
