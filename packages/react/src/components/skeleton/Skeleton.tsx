import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cx } from "../../utils/cx";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** CSS width (number = px). Defaults to `100%`. */
  width?: number | string;
  /** CSS height (number = px). Defaults to `1em`. */
  height?: number | string;
  /** Renders a circle (radius full); set `width` and `height` equal. */
  circle?: boolean;
}

const toCss = (value: number | string | undefined) => (typeof value === "number" ? `${value}px` : value);

/**
 * Loading placeholder with a 1.4s shimmer (static under reduced motion). Hidden
 * from assistive tech: mark the loading region with `aria-busy` instead.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { width, height, circle = false, className, style, ...props },
  ref,
) {
  const sizing: CSSProperties = { width: toCss(width), height: toCss(height), ...style };
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx("mrd-skeleton", className)}
      data-shape={circle ? "circle" : "rect"}
      style={sizing}
      {...props}
    />
  );
});
