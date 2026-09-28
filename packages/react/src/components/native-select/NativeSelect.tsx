import { forwardRef, type SelectHTMLAttributes } from "react";
import { cx } from "../../utils/cx";
import { useFieldControlProps } from "../field/field-context";

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Height: `sm` 36px, `md` 46px (default), `lg` 50px. */
  size?: "sm" | "md" | "lg";
  /** Forces the invalid style and `aria-invalid`. Inside a `Field`, derived from its `error`. */
  invalid?: boolean;
  /** Adds a disabled, empty first option shown when nothing is selected. */
  placeholder?: string;
}

/**
 * The platform `<select>` with Merid styling: full native keyboard, mobile pickers
 * and form participation for free. Pass `<option>` children.
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
  { size = "md", invalid, placeholder, className, id, required, disabled, children, ...props },
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
  const withPlaceholder = placeholder !== undefined && props.value === undefined && props.defaultValue === undefined;
  return (
    <span className={cx("mrd-native-select", className)} data-size={size}>
      <select
        ref={ref}
        className="mrd-native-select__control"
        data-invalid={isInvalid || undefined}
        defaultValue={withPlaceholder ? "" : undefined}
        {...props}
        {...wiring}
      >
        {placeholder !== undefined ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <svg className="mrd-native-select__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
});
