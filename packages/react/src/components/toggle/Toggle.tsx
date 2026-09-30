"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/use-controllable";

export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Pressed state (controlled). */
  pressed?: boolean;
  /** Initial pressed state (uncontrolled). Defaults to `false`. */
  defaultPressed?: boolean;
  /** Called with the new pressed state. */
  onPressedChange?: (pressed: boolean) => void;
  /** Height: `sm` 28px, `md` 32px (default), `lg` 40px. */
  size?: ToggleSize;
}

/**
 * Two-state button (`aria-pressed`). Use for a formatting or view option that stays on,
 * like Bold or "Show grid". Icon-only toggles need an `aria-label`.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { pressed, defaultPressed = false, onPressedChange, size = "md", className, onClick, type = "button", ...props },
  ref,
) {
  const [on, setOn] = useControllableState(pressed, defaultPressed, onPressedChange);
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={on}
      data-state={on ? "on" : "off"}
      data-size={size}
      className={cx("mrd-toggle", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOn(!on);
      }}
      {...props}
    />
  );
});
