"use client";

import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Label } from "../label/Label";
import { FieldContext, type FieldContextValue } from "./field-context";

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Visible label, wired to the control via `htmlFor`. */
  label: ReactNode;
  /** Helper text below the control, linked via `aria-describedby`. */
  description?: ReactNode;
  /** Error message. When present the control gets `aria-invalid` and the message is linked via `aria-describedby`. */
  error?: ReactNode;
  /** Marks the control required and shows the visual marker. */
  required?: boolean;
  /** Disables the control and dims the label. */
  disabled?: boolean;
  /** Explicit id for the control. Generated when omitted. */
  id?: string;
  /** A single Merid control (Input, Textarea, NativeSelect, …) — it picks up the wiring from context. */
  children: ReactNode;
}

/**
 * Label + control + description + error, wired together with ids,
 * `aria-describedby` and `aria-invalid`. Merid controls read the wiring from context.
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, description, error, required = false, disabled = false, id, className, children, ...props },
  ref,
) {
  const autoId = useId();
  const controlId = id ?? `mrd-field-${autoId}`;
  const hasError = error !== undefined && error !== null && error !== false;
  const hasDescription = description !== undefined && description !== null && description !== false;

  const context = useMemo<FieldContextValue>(
    () => ({
      controlId,
      labelId: `${controlId}-label`,
      descriptionId: hasDescription ? `${controlId}-description` : undefined,
      errorId: hasError ? `${controlId}-error` : undefined,
      invalid: hasError,
      required,
      disabled,
    }),
    [controlId, hasDescription, hasError, required, disabled],
  );

  return (
    <FieldContext.Provider value={context}>
      <div
        ref={ref}
        className={cx("mrd-field", className)}
        data-invalid={hasError || undefined}
        data-disabled={disabled || undefined}
        {...props}
      >
        <Label id={context.labelId} htmlFor={controlId} required={required} disabled={disabled}>
          {label}
        </Label>
        {children}
        {hasDescription ? (
          <p id={context.descriptionId} className="mrd-field__description">
            {description}
          </p>
        ) : null}
        {hasError ? (
          <p id={context.errorId} className="mrd-field__error">
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
});
