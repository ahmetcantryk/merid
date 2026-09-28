"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { useRadioGroupContext } from "./RadioGroup";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children" | "value"> {
  /** Value submitted and reported to `RadioGroup.onValueChange`. */
  value: string;
  /** Visible label next to the circle. */
  children?: ReactNode;
  /** Secondary line under the label, linked via `aria-describedby`. */
  description?: ReactNode;
}

/**
 * A native radio with an 18px circle and accent dot. Use inside `RadioGroup`,
 * which supplies `name`, the checked state and arrow-key roving.
 * `className` and `style` go on the outer wrapper.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, children, description, className, style, disabled, id, onChange, ...props },
  ref,
) {
  const group = useRadioGroupContext();
  const autoId = useId();
  const inputId = id ?? `mrd-radio-${autoId}`;
  const descriptionId = description ? `${inputId}-desc` : undefined;
  const isDisabled = disabled ?? group?.disabled ?? false;
  const groupProps = group
    ? {
        name: group.name,
        checked: group.value === value,
        "data-invalid": group.invalid || undefined,
        required: group.required || undefined,
        // Single tab stop: only the selected radio is tabbable once a value exists.
        tabIndex: group.value !== undefined && group.value !== value ? -1 : undefined,
      }
    : {};

  return (
    <span className={cx("mrd-radio", className)} style={style} data-disabled={isDisabled || undefined}>
      <span className="mrd-radio__control">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className="mrd-radio__input"
          value={value}
          disabled={isDisabled}
          aria-describedby={descriptionId}
          onChange={(event) => {
            onChange?.(event);
            if (!event.defaultPrevented && event.target.checked) group?.select(value);
          }}
          {...groupProps}
          {...props}
        />
        <span className="mrd-radio__circle" aria-hidden="true" />
      </span>
      {children || description ? (
        <span className="mrd-radio__text">
          {children ? (
            <label htmlFor={inputId} className="mrd-radio__label">
              {children}
            </label>
          ) : null}
          {description ? (
            <span id={descriptionId} className="mrd-radio__description">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
});
