import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cx } from "../../utils/cx";
import { useFieldControlProps } from "../field/field-context";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Forces the invalid style and `aria-invalid`. Inside a `Field`, derived from its `error`. */
  invalid?: boolean;
  /** User resize handle. Defaults to `vertical`. */
  resize?: "none" | "vertical" | "both";
}

/** Multi-line text input. Picks up id / aria wiring from a surrounding `Field`. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, resize = "vertical", rows = 4, className, id, required, disabled, ...props },
  ref,
) {
  const { invalid: isInvalid, ...wiring } = useFieldControlProps({
    id,
    required,
    disabled,
    invalid,
    "aria-describedby": props["aria-describedby"],
    "aria-invalid": props["aria-invalid"],
  });
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx("mrd-textarea", className)}
      data-resize={resize}
      data-invalid={isInvalid || undefined}
      {...props}
      {...wiring}
    />
  );
});
