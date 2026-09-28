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
import { cx } from "../../utils/cx";
import { nextRovingIndex } from "../../utils/roving";
import { useControllableState } from "../../utils/use-controllable";

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
 * Name it with `aria-label` or `aria-labelledby`.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    value,
    defaultValue,
    onValueChange,
    name,
    orientation = "vertical",
    disabled = false,
    required = false,
    invalid = false,
    className,
    children,
    onKeyDown,
    ...props
  },
  ref,
) {
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
        className={cx("mrd-radio-group", className)}
        data-orientation={orientation}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});
