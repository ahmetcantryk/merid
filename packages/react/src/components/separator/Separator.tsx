import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../utils/cx";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Direction of the hairline. Defaults to `horizontal`. */
  orientation?: "horizontal" | "vertical";
  /**
   * When true (default) the line is purely visual (`role="none"`). Set false when it
   * separates meaningful groups so it is exposed as `role="separator"`.
   */
  decorative?: boolean;
}

/** A 1px `--mrd-line` hairline. */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", decorative = true, className, ...props },
  ref,
) {
  const a11y = decorative
    ? { role: "none" }
    : { role: "separator", "aria-orientation": orientation === "vertical" ? ("vertical" as const) : undefined };
  return (
    <div ref={ref} className={cx("mrd-separator", className)} data-orientation={orientation} {...a11y} {...props} />
  );
});
