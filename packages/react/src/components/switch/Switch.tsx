import { forwardRef, useId, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/use-controllable";

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value" | "defaultValue" | "children"> {
  /** On state (controlled). */
  checked?: boolean;
  /** Initial on state (uncontrolled). Defaults to `false`. */
  defaultChecked?: boolean;
  /** Called with the new state when toggled. */
  onCheckedChange?: (checked: boolean) => void;
  /** Visible label next to the track; it becomes the accessible name. Otherwise pass `aria-label`. */
  children?: ReactNode;
  /** Which side the label sits on. Defaults to `end`. */
  labelPosition?: "start" | "end";
  /** When set, a hidden input with this name submits `value` (default `"on"`) while on. */
  name?: string;
  /** Submitted value when on. */
  value?: string;
}

/** A 34×20 on/off toggle with `role="switch"`. Space and Enter toggle it. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    children,
    labelPosition = "end",
    name,
    value = "on",
    className,
    disabled,
    onClick,
    id,
    ...props
  },
  ref,
) {
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  const autoId = useId();
  const buttonId = id ?? `mrd-switch-${autoId}`;
  const labelId = `${buttonId}-label`;

  const control = (
    <button
      ref={ref}
      id={buttonId}
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={children ? labelId : undefined}
      className="mrd-switch__track"
      data-state={on ? "on" : "off"}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOn(!on);
      }}
      {...props}
    >
      <span className="mrd-switch__thumb" aria-hidden="true" />
    </button>
  );

  return (
    <span
      className={cx("mrd-switch", className)}
      data-state={on ? "on" : "off"}
      data-label-position={labelPosition}
      data-disabled={disabled || undefined}
    >
      {control}
      {children ? (
        <label id={labelId} htmlFor={buttonId} className="mrd-switch__label">
          {children}
        </label>
      ) : null}
      {name && on ? <input type="hidden" name={name} value={value} /> : null}
    </span>
  );
});
