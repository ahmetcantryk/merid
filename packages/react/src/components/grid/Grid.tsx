import { forwardRef, type CSSProperties } from "react";
import { cx } from "../../utils/cx";
import type { AsProps } from "../../utils/polymorphic";
import { spaceVar, type SpaceToken } from "../../utils/space";

export interface GridProps extends AsProps {
  /** Fixed number of equal columns. Collapses to one column at ≤ 640px. Ignored when `minItemWidth` is set. */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Responsive auto-fit: each column is at least this wide (number = px). */
  minItemWidth?: number | string;
  /** Gap from the `--mrd-space-*` scale. Defaults to `6` (24px). */
  gap?: SpaceToken;
}

/** Two-dimensional grid layout. Renders a `div` unless `as` is given. */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  { as: Component = "div", columns = 3, minItemWidth, gap = 6, className, style, ...props },
  ref,
) {
  const min = typeof minItemWidth === "number" ? `${minItemWidth}px` : minItemWidth;
  const vars = {
    "--mrd-grid-gap": spaceVar(gap),
    "--mrd-grid-columns": min ? undefined : String(columns),
    "--mrd-grid-min": min,
    ...style,
  } as CSSProperties;
  return (
    <Component
      ref={ref}
      className={cx("mrd-grid", className)}
      data-layout={min ? "auto" : "fixed"}
      style={vars}
      {...props}
    />
  );
});
