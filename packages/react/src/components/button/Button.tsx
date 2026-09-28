"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { Slot } from "../../internal/ovl-slot";
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
  /**
   * Render the single child element (e.g. a router `<Link>`) styled as this button instead of a
   * `<button>`. Props, ref, handlers and className merge onto the child; the child's own children
   * are wrapped in the button's content span. `disabled` / `loading` become `aria-disabled` and block clicks.
   */
  asChild?: boolean;
}

function ButtonContent({ leadingIcon, trailingIcon, children }: Pick<ButtonProps, "leadingIcon" | "trailingIcon" | "children">) {
  return (
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
  );
}

/** The primary action primitive. Defaults to `type="button"`. Use `asChild` to style a router link as a button. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    loading = false,
    leadingIcon,
    trailingIcon,
    fullWidth = false,
    asChild = false,
    disabled,
    type = "button",
    className,
    children,
    onClick,
    ...props
  },
  ref,
) {
  const shared = {
    className: cx("mrd-button", className),
    "data-variant": variant,
    "data-size": size,
    "data-loading": loading || undefined,
    "data-full-width": fullWidth || undefined,
    "aria-busy": loading || undefined,
  };
  const spinner = loading ? <Spinner className="mrd-button__spinner" size="sm" label={null} /> : null;

  if (asChild) {
    const child = Children.only(children);
    if (!isValidElement(child)) throw new Error("<Button asChild> expects a single React element child.");
    const element = child as ReactElement<{ children?: ReactNode }>;
    const blocked = Boolean(disabled || loading);
    return (
      <Slot
        ref={ref as unknown as Ref<HTMLElement>}
        {...shared}
        data-disabled={disabled || undefined}
        aria-disabled={blocked || undefined}
        onClick={(event: MouseEvent<HTMLElement>) => {
          if (blocked) {
            event.preventDefault();
            return;
          }
          onClick?.(event as MouseEvent<HTMLButtonElement>);
        }}
        {...(props as Record<string, unknown>)}
      >
        {cloneElement(
          element,
          undefined,
          <>
            <ButtonContent leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
              {element.props.children}
            </ButtonContent>
            {spinner}
          </>,
        )}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      {...shared}
      disabled={disabled}
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
      <ButtonContent leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
        {children}
      </ButtonContent>
      {spinner}
    </button>
  );
});
