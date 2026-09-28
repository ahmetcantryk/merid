import { forwardRef, type CSSProperties } from "react";
import { cx } from "../../utils/cx";
import type { AsProps } from "../../utils/polymorphic";
import { spaceVar, type SpaceToken } from "../../utils/space";

export interface StackProps extends AsProps {
  /** Main axis. Defaults to `column`. */
  direction?: "row" | "column";
  /** Gap from the `--mrd-space-*` scale (e.g. `4` = 16px). Defaults to `4`. */
  gap?: SpaceToken;
  /** Cross-axis alignment (`align-items`). */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Main-axis distribution (`justify-content`). */
  justify?: "start" | "center" | "end" | "between";
  /** Allows items to wrap onto multiple lines. */
  wrap?: boolean;
}

/** One-dimensional flex layout. Renders a `div` unless `as` is given. */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { as: Component = "div", direction = "column", gap = 4, align, justify, wrap = false, className, style, ...props },
  ref,
) {
  const vars = { "--mrd-stack-gap": spaceVar(gap), ...style } as CSSProperties;
  return (
    <Component
      ref={ref}
      className={cx("mrd-stack", className)}
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap || undefined}
      style={vars}
      {...props}
    />
  );
});
