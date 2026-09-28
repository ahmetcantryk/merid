"use client";

import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { nextRovingIndex } from "../../utils/roving";
import { useControllableState } from "../../utils/use-controllable";

export interface SegmentedControlOption {
  /** Value reported on selection. */
  value: string;
  /** Visible content of the segment. */
  label: ReactNode;
  /** Accessible name when `label` is not text (e.g. an icon). */
  ariaLabel?: string;
  /** Makes the segment unselectable and skipped by arrow keys. */
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "children"> {
  /** The segments. */
  options: SegmentedControlOption[];
  /** Selected value (controlled). */
  value?: string;
  /** Initially selected value (uncontrolled). Defaults to the first enabled option. */
  defaultValue?: string;
  /** Called with the new value when the selection changes. */
  onValueChange?: (value: string) => void;
  /** Stretches segments to fill the container. */
  fullWidth?: boolean;
  /** Disables the whole control. */
  disabled?: boolean;
}

/**
 * Pill-shaped single-select toggle with radiogroup semantics. One tab stop;
 * Arrow keys / Home / End move and select (WAI-ARIA APG radio group).
 * Name it with `aria-label` or `aria-labelledby`.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { options, value, defaultValue, onValueChange, fullWidth = false, disabled = false, className, onKeyDown, ...props },
  ref,
) {
  const firstEnabled = options.find((o) => !o.disabled)?.value ?? "";
  const [current, setCurrent] = useControllableState(value, defaultValue ?? firstEnabled, onValueChange);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const enabled = disabled ? [] : options.filter((o) => !o.disabled);
  // The selected segment is the tab stop; if the value matches no enabled option, fall back to the first enabled one.
  const tabStop = enabled.some((o) => o.value === current) ? current : enabled[0]?.value;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const index = enabled.findIndex((o) => o.value === current);
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const next = nextRovingIndex(event.key, Math.max(index, 0), enabled.length, rtl);
    if (next === null) return;
    event.preventDefault();
    const option = enabled[next];
    if (!option) return;
    setCurrent(option.value);
    buttonRefs.current.get(option.value)?.focus();
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-disabled={disabled || undefined}
      className={cx("mrd-segmented", className)}
      data-full-width={fullWidth || undefined}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {options.map((option) => {
        const selected = option.value === current;
        return (
          <button
            key={option.value}
            ref={(node) => {
              if (node) buttonRefs.current.set(option.value, node);
              else buttonRefs.current.delete(option.value);
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.ariaLabel}
            tabIndex={option.value === tabStop ? 0 : -1}
            disabled={disabled || option.disabled}
            className="mrd-segmented__item"
            data-state={selected ? "on" : "off"}
            onClick={() => setCurrent(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
});
