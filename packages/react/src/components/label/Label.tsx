import { forwardRef, type LabelHTMLAttributes } from "react";
import { cx } from "../../utils/cx";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Appends a visual required marker (`*`, hidden from AT — set `required` on the control itself). */
  required?: boolean;
  /** Dims the label to match a disabled control. */
  disabled?: boolean;
}

/** Form label: 14px / 500 / ink. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required = false, disabled = false, className, children, ...props },
  ref,
) {
  return (
    <label ref={ref} className={cx("mrd-label", className)} data-disabled={disabled || undefined} {...props}>
      {children}
      {required ? (
        <span className="mrd-label__required" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
});
