import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";

export type IconButtonVariant = "ghost" | "secondary" | "primary";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  /** Accessible name. Required because the button has no visible text. */
  label: string;
  /** The icon. Rendered `aria-hidden`. */
  icon: ReactNode;
  /** Visual style. Defaults to `ghost`. */
  variant?: IconButtonVariant;
  /** Square size: `sm` 32px, `md` 36px, `lg` 40px. Defaults to `md`. */
  size?: IconButtonSize;
}

/** A square, icon-only button. `label` becomes its `aria-label`. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = "ghost", size = "md", type = "button", className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cx("mrd-icon-button", className)}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      <span className="mrd-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
});
