"use client";

import { forwardRef, useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx, joinIds } from "../../utils/cx";
import { mergeRefs } from "../../utils/merge-refs";
import { useFieldContext, useFieldControlProps } from "../field/field-context";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> {
  /** Visible label rendered next to the box. Omit and pass `aria-label` for a bare checkbox. */
  children?: ReactNode;
  /** Secondary line under the label, linked via `aria-describedby`. */
  description?: ReactNode;
  /** Shows the mixed (“–”) state. Sets the DOM `indeterminate` property; `aria-checked` follows. */
  indeterminate?: boolean;
  /** Forces the invalid style and `aria-invalid`. */
  invalid?: boolean;
}

/**
 * A native checkbox with an 18px box. Space toggles it; it participates in forms.
 * `className` and `style` go on the outer wrapper; other props on the `<input>`.
 *
 * Inside a `Field`, the Field label names the checkbox. If children are also given they still
 * render as a clickable `<label>`, but act as its description (`aria-describedby`) so the
 * control is never double-labelled.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, description, indeterminate = false, invalid, className, id, required, disabled, style, ...props },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useFieldContext();
  const { invalid: isInvalid, ...wiring } = useFieldControlProps({
    id,
    required,
    disabled,
    invalid,
    "aria-describedby": props["aria-describedby"],
    "aria-invalid": props["aria-invalid"],
  });
  const autoId = useId();
  const inputId = wiring.id ?? `mrd-checkbox-${autoId}`;
  const descriptionId = description ? `${inputId}-desc` : undefined;
  const inField = field !== null && Boolean(children);
  const ownLabelId = inField ? `${inputId}-text` : undefined;
  const labelledBy = props["aria-labelledby"] ?? (inField ? field.labelId : undefined);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <span
      className={cx("mrd-checkbox", className)}
      style={style}
      data-disabled={wiring.disabled || undefined}
      data-invalid={isInvalid || undefined}
    >
      <span className="mrd-checkbox__control">
        <input
          ref={mergeRefs(ref, inputRef)}
          type="checkbox"
          className="mrd-checkbox__input"
          data-indeterminate={indeterminate || undefined}
          {...props}
          {...wiring}
          id={inputId}
          data-invalid={isInvalid || undefined}
          aria-labelledby={labelledBy}
          aria-describedby={joinIds(wiring["aria-describedby"], ownLabelId, descriptionId)}
        />
        <svg className="mrd-checkbox__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
          {indeterminate ? (
            <path d="M4 8h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path
              d="M3.5 8.5l3 3 6-7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </span>
      {children || description ? (
        <span className="mrd-checkbox__text">
          {children ? (
            <label id={ownLabelId} htmlFor={inputId} className="mrd-checkbox__label">
              {children}
            </label>
          ) : null}
          {description ? (
            <span id={descriptionId} className="mrd-checkbox__description">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
});
