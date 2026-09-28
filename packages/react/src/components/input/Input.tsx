"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { useFieldControlProps } from "../field/field-context";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Height: `sm` 36px, `md` 46px (default), `lg` 50px. */
  size?: InputSize;
  /** Forces the invalid style and `aria-invalid`. Inside a `Field`, derived from its `error`. */
  invalid?: boolean;
  /** Decorative element before the text (icon, prefix). */
  leading?: ReactNode;
  /** Decorative element after the text (icon, unit). */
  trailing?: ReactNode;
}

/**
 * Single-line text input. Picks up id / aria wiring from a surrounding `Field`.
 * `className` and `style` always go on the root element: the `<input>` itself, or the
 * `.mrd-input-group` wrapper when `leading`/`trailing` are given. Other props go on the `<input>`.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", invalid, leading, trailing, className, style, id, required, disabled, type = "text", ...props },
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

  const grouped = Boolean(leading || trailing);
  const input = (
    <input
      ref={ref}
      type={type}
      className={cx("mrd-input", !grouped && className)}
      style={grouped ? undefined : style}
      data-size={size}
      data-invalid={isInvalid || undefined}
      {...props}
      {...wiring}
    />
  );

  if (!grouped) return input;

  return (
    <span className={cx("mrd-input-group", className)} style={style} data-size={size}>
      {leading ? (
        <span className="mrd-input-group__addon" data-side="leading" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      {input}
      {trailing ? (
        <span className="mrd-input-group__addon" data-side="trailing" aria-hidden="true">
          {trailing}
        </span>
      ) : null}
    </span>
  );
});
