// src/components/__mocks__/LazyImage.tsx
// Typed manual mock for your LazyImage that renders a plain <img> and strips wrapper-only props.

import * as React from "react";

export type LazyImageProps = {
  alt: string;
  src: string;
  className?: string;
  wrapperClassName?: string; // internal prop -> must NOT reach DOM
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "alt" | "src">;

const LazyImage = React.forwardRef<HTMLImageElement, LazyImageProps>(
  function LazyImage(
    { alt, src, wrapperClassName: _ignore, ...imgProps },
    ref
  ) {
    return <img ref={ref} alt={alt} src={src} {...imgProps} />;
  }
);

export default LazyImage;
