"use client";

import {
  forwardRef,
  useMemo,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/use-controllable";
import { useFieldControlProps } from "../field/field-context";
import { clampValue, createNumberParser, decimalsOf } from "./number-format";

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size" | "type" | "min" | "max" | "step"> {
  /** Current value (controlled); `null` is empty. */
  value?: number | null;
  /** Initial value (uncontrolled). */
  defaultValue?: number | null;
  /** Called with the committed value (on step, Enter or blur). */
  onValueChange?: (value: number | null) => void;
  /** Lowest allowed value. */
  min?: number;
  /** Highest allowed value. */
  max?: number;
  /** Amount added by the buttons and arrow keys. Defaults to 1. */
  step?: number;
  /** Amount added by Page Up / Page Down. Defaults to `step * 10`. */
  largeStep?: number;
  /** BCP 47 locale for formatting and parsing (e.g. `"tr-TR"`). Defaults to the runtime locale. */
  locale?: string;
  /** `Intl.NumberFormat` options: currency, percent, unit, fraction digits… */
  formatOptions?: Intl.NumberFormatOptions;
  /** Height: `sm` 28px, `md` 32px (default), `lg` 40px. */
  size?: "sm" | "md" | "lg";
  /** Invalid style and `aria-invalid`. Inside a `Field`, derived from its `error`. */
  invalid?: boolean;
  /** Hide the increment / decrement buttons. */
  hideStepper?: boolean;
  /** Accessible name of the increment button. Defaults to `"Increase"`. */
  incrementLabel?: string;
  /** Accessible name of the decrement button. Defaults to `"Decrease"`. */
  decrementLabel?: string;
}

function StepIcon({ kind }: { kind: "plus" | "minus" }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
      <path d={kind === "plus" ? "M2.5 6h7M6 2.5v7" : "M2.5 6h7"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Numeric field with a `spinbutton` role, stepper buttons and locale-aware formatting via
 * `Intl.NumberFormat`. Typed text is parsed in the same locale and committed on Enter or blur.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value,
    defaultValue = null,
    onValueChange,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    step = 1,
    largeStep,
    locale,
    formatOptions,
    size = "md",
    invalid,
    hideStepper = false,
    incrementLabel = "Increase",
    decrementLabel = "Decrease",
    className,
    style,
    id,
    name,
    required,
    disabled,
    readOnly,
    onKeyDown,
    onBlur,
    onFocus,
    ...props
  },
  ref,
) {
  const [current, setCurrent] = useControllableState<number | null>(value, defaultValue, onValueChange);
  const [draft, setDraft] = useState<string | null>(null);
  const { invalid: isInvalid, ...wiring } = useFieldControlProps({
    id,
    required,
    disabled,
    invalid,
    "aria-describedby": props["aria-describedby"],
    "aria-invalid": props["aria-invalid"],
  });
  const optionsKey = JSON.stringify(formatOptions ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const parser = useMemo(() => createNumberParser(locale, formatOptions), [locale, optionsKey]);
  const precision = Math.max(decimalsOf(step), min > Number.MIN_SAFE_INTEGER ? decimalsOf(min) : 0, formatOptions?.style === "percent" ? 2 : 0);
  const text = draft ?? (current === null ? "" : parser.format(current));
  const inert = Boolean(wiring.disabled) || Boolean(readOnly);

  // Stepped values round to the step's precision (no float noise); typed values keep their own digits.
  const commit = (next: number | null, typed = false) => {
    setDraft(null);
    const digits = typed && next !== null ? Math.max(precision, Math.min(decimalsOf(next), 10)) : precision;
    const resolved = next === null ? null : clampValue(next, min, max, digits);
    if (resolved !== current) setCurrent(resolved);
  };

  const commitDraft = () => {
    if (draft === null) return;
    commit(parser.parse(draft), true);
  };

  const stepBy = (delta: number) => {
    if (inert) return;
    const base = draft !== null ? parser.parse(draft) : current;
    if (base === null) {
      commit(delta > 0 ? (min > Number.MIN_SAFE_INTEGER ? min : 0) : max < Number.MAX_SAFE_INTEGER ? max : 0);
      return;
    }
    commit(base + delta);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const big = largeStep ?? step * 10;
    const hasMin = min > Number.MIN_SAFE_INTEGER;
    const hasMax = max < Number.MAX_SAFE_INTEGER;
    const actions: Record<string, (() => void) | undefined> = {
      ArrowUp: () => stepBy(step),
      ArrowDown: () => stepBy(-step),
      PageUp: () => stepBy(big),
      PageDown: () => stepBy(-big),
      Home: hasMin && !inert ? () => commit(min) : undefined,
      End: hasMax && !inert ? () => commit(max) : undefined,
      Enter: draft !== null ? commitDraft : undefined,
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  const atMin = current !== null && current <= min;
  const atMax = current !== null && current >= max;

  return (
    <span
      className={cx("mrd-number-input", className)}
      style={style}
      data-size={size}
      data-invalid={isInvalid || undefined}
      data-disabled={wiring.disabled || undefined}
    >
      <input
        ref={ref}
        type="text"
        role="spinbutton"
        inputMode={(formatOptions?.maximumFractionDigits ?? 0) === 0 && decimalsOf(step) === 0 ? "numeric" : "decimal"}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="mrd-number-input__field"
        aria-valuenow={current ?? undefined}
        aria-valuemin={min > Number.MIN_SAFE_INTEGER ? min : undefined}
        aria-valuemax={max < Number.MAX_SAFE_INTEGER ? max : undefined}
        aria-valuetext={current === null ? undefined : parser.format(current)}
        readOnly={readOnly}
        value={text}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={(event) => {
          commitDraft();
          onBlur?.(event);
        }}
        {...props}
        {...wiring}
      />
      {name ? <input type="hidden" name={name} value={current ?? ""} disabled={wiring.disabled} /> : null}
      {hideStepper ? null : (
        <span className="mrd-number-input__stepper">
          <button
            type="button"
            tabIndex={-1}
            className="mrd-number-input__step"
            aria-label={decrementLabel}
            disabled={inert || atMin}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => stepBy(-step)}
          >
            <StepIcon kind="minus" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="mrd-number-input__step"
            aria-label={incrementLabel}
            disabled={inert || atMax}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => stepBy(step)}
          >
            <StepIcon kind="plus" />
          </button>
        </span>
      )}
    </span>
  );
});
