import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../utils/cx";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Size of the key cap. Defaults to `md`. */
  size?: "sm" | "md";
}

/** A keyboard key cap, rendered as `<kbd>`. Nest several for a chord. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ size = "md", className, ...props }, ref) {
  return <kbd ref={ref} className={cx("mrd-kbd", className)} data-size={size} {...props} />;
});
