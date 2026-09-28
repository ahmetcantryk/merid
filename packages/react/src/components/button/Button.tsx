"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Spinner } from "../spinner/Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` is the single accent action; defaults to `secondary`. */
  variant?: ButtonVariant;
  /** Height and padding: `sm` 28px, `md` 32px, `lg` 40px. Defaults to `md`. */
  size?: ButtonSize;
  /** Shows a spinner, keeps the button's width and sets `aria-busy`. The button is not clickable while loading. */
  loading?: boolean;
  /** Icon rendered before the label. Hidden from assistive tech. */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. Hidden from assistive tech. */
  trailingIcon?: ReactNode;
  /** Stretches the button to the width of its container. */
  fullWidth?: boolean;
}

/** The primary action primitive. Defaults to `type="button"`. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    loading = false,
    leadingIcon,
    trailingIcon,
    fullWidth = false,
    disabled,
    type = "button",
    className,
    children,
    onClick,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx("mrd-button", className)}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-full-width={fullWidth || undefined}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...props}
    >
      <span className="mrd-button__content">
        {leadingIcon ? (
          <span className="mrd-button__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        {children}
        {trailingIcon ? (
          <span className="mrd-button__icon" aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
      </span>
      {loading ? <Spinner className="mrd-button__spinner" size="sm" label={null} /> : null}
    </button>
  );
});
