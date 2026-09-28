import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cx } from "../../utils/cx";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value. Omit (or pass `null`) for an indeterminate bar. */
  value?: number | null;
  /** Maximum value. Defaults to `100`. */
  max?: number;
  /** Bar thickness: `sm` 4px, `md` 6px (default), `lg` 8px. */
  size?: "sm" | "md" | "lg";
  /** Human-readable value for AT, e.g. "3 of 5 steps". Defaults to the percentage. */
  valueText?: string;
}

/**
 * Linear progress bar with `role="progressbar"`. Name it with `aria-label` or `aria-labelledby`.
 * When indeterminate, no `aria-value*` attributes are set.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = null, max = 100, size = "md", valueText, className, style, ...props },
  ref,
) {
  const indeterminate = value === null || Number.isNaN(value);
  const safeMax = max > 0 ? max : 100;
  const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), safeMax);
  const percent = (clamped / safeMax) * 100;
  const vars = { "--mrd-progress-value": `${percent}%`, ...style } as CSSProperties;
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : safeMax}
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-valuetext={indeterminate ? undefined : (valueText ?? `${Math.round(percent)}%`)}
      className={cx("mrd-progress", className)}
      data-size={size}
      data-state={indeterminate ? "indeterminate" : percent >= 100 ? "complete" : "loading"}
      style={vars}
      {...props}
    >
      <div className="mrd-progress__bar" />
    </div>
  );
});
