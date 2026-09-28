import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../utils/cx";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Diameter: `sm` 14px, `md` 18px, `lg` 24px. Defaults to `md`. */
  size?: SpinnerSize;
  /**
   * Accessible name announced to assistive tech. Pass `null` when the spinner is
   * purely decorative (e.g. inside a busy button) — it is then hidden from AT.
   */
  label?: string | null;
}

/** Indeterminate loading indicator. Inherits `currentColor`. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "md", label = "Loading", className, ...props },
  ref,
) {
  const a11y = label === null ? { "aria-hidden": true as const } : { role: "status", "aria-label": label };
  return (
    <span ref={ref} className={cx("mrd-spinner", className)} data-size={size} {...a11y} {...props}>
      <svg className="mrd-spinner__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <circle className="mrd-spinner__track" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
});
