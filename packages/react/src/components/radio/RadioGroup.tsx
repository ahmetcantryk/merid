"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx, joinIds } from "../../utils/cx";
import { nextRovingIndex } from "../../utils/roving";
import { useControllableState } from "../../utils/use-controllable";
import { useFieldContext } from "../field/field-context";

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  select: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/** Reads the surrounding RadioGroup, if any. */
export function useRadioGroupContext(): RadioGroupContextValue | null {
  return useContext(RadioGroupContext);
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Selected value (controlled). */
  value?: string;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string;
  /** Called with the new value when the selection changes. */
  onValueChange?: (value: string) => void;
  /** Form field name shared by every radio. Generated when omitted. */
  name?: string;
  /** Layout direction. Defaults to `vertical`. */
  orientation?: "vertical" | "horizontal";
  /** Disables every radio in the group. */
  disabled?: boolean;
  /** Marks the group required for form validation. */
  required?: boolean;
  /** Marks the group invalid (`aria-invalid`). */
  invalid?: boolean;
  /** `Radio` elements. */
  children?: ReactNode;
}

/**
 * `role="radiogroup"` wrapper. Tab enters the group on the selected radio;
 * Arrow keys (and Home/End) move and select, wrapping at the ends.
 * Name it with `aria-label` or `aria-labelledby`; inside a `Field` it is named by the Field label and
 * picks up its description, error (`aria-invalid`), required and disabled state.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    value,
    defaultValue,
    onValueChange,
    name,
    orientation = "vertical",
    disabled: disabledProp,
    required: requiredProp,
    invalid: invalidProp,
    className,
    children,
    onKeyDown,
    id,
    ...props
  },
  ref,
) {
  const field = useFieldContext();
  const disabled = disabledProp ?? field?.disabled ?? false;
  const required = requiredProp ?? field?.required ?? false;
  const invalid = invalidProp ?? field?.invalid ?? false;
  const labelledBy = props["aria-labelledby"] ?? (field && !props["aria-label"] ? field.labelId : undefined);
  const describedBy = joinIds(props["aria-describedby"], field?.descriptionId, invalid ? field?.errorId : undefined);
  const autoName = useId();
  const [current, setCurrent] = useControllableState<string | undefined>(value, defaultValue, (next) => {
    if (next !== undefined) onValueChange?.(next);
  });

  const context = useMemo<RadioGroupContextValue>(
    () => ({ name: name ?? `mrd-radio-${autoName}`, value: current, disabled, required, invalid, select: setCurrent }),
    [name, autoName, current, disabled, required, invalid, setCurrent],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const radios = Array.from(
      event.currentTarget.querySelectorAll<HTMLInputElement>('input[type="radio"]:not(:disabled)'),
    );
    const index = radios.indexOf(event.target as HTMLInputElement);
    if (index === -1) return;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const next = nextRovingIndex(event.key, index, radios.length, rtl);
    if (next === null) return;
    event.preventDefault();
    const target = radios[next];
    if (!target) return;
    target.focus();
    setCurrent(target.value);
  };

  return (
    <RadioGroupContext.Provider value={context}>
      <div
        ref={ref}
        role="radiogroup"
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        className={cx("mrd-radio-group", className)}
        data-orientation={orientation}
        onKeyDown={handleKeyDown}
        {...props}
        id={id ?? field?.controlId}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});
