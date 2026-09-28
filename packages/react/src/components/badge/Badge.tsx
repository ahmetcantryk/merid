import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../utils/cx";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "solid";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Colour tone. Defaults to `neutral`. `solid` is the only filled tone. */
  tone?: BadgeTone;
  /** Shows a small leading status dot in the current text colour. */
  dot?: boolean;
}

/** A 22px pill for status and counts. Not interactive. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = "neutral", dot = false, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx("mrd-badge", className)} data-tone={tone} {...props}>
      {dot ? <span className="mrd-badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
});
