"use client";

import { forwardRef, useId, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/use-controllable";
import { useFieldControlProps } from "../field/field-context";

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
  /** Forces the invalid style and `aria-invalid`. Inside a `Field`, derived from its `error`. */
  invalid?: boolean;
}

/**
 * A 34×20 on/off toggle with `role="switch"`. Space and Enter toggle it.
 * Inside a `Field` it takes the Field id (so the Field label names it), `aria-describedby`,
 * `aria-invalid` and `disabled`.
 */
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
    invalid,
    onClick,
    id,
    ...props
  },
  ref,
) {
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  const {
    invalid: isInvalid,
    required: _required,
    ...wiring
  } = useFieldControlProps({
    id,
    disabled,
    invalid,
    "aria-describedby": props["aria-describedby"],
    "aria-invalid": props["aria-invalid"],
  });
  const autoId = useId();
  const buttonId = wiring.id ?? `mrd-switch-${autoId}`;
  const isDisabled = wiring.disabled ?? false;
  const labelId = `${buttonId}-label`;

  const control = (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={children ? labelId : undefined}
      className="mrd-switch__track"
      data-state={on ? "on" : "off"}
      data-invalid={isInvalid || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOn(!on);
      }}
      {...props}
      id={buttonId}
      disabled={isDisabled}
      aria-invalid={wiring["aria-invalid"]}
      aria-describedby={wiring["aria-describedby"]}
    >
      <span className="mrd-switch__thumb" aria-hidden="true" />
    </button>
  );

  return (
    <span
      className={cx("mrd-switch", className)}
      data-state={on ? "on" : "off"}
      data-label-position={labelPosition}
      data-disabled={isDisabled || undefined}
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
