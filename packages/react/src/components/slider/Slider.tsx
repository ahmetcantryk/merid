"use client";

import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/merge-refs";
import { useControllableState } from "../../utils/use-controllable";
import { clampValue, decimalsOf } from "../number-input/number-format";

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir"> {
  /**
   * Thumb values (controlled). One value is a single slider, two values a range.
   */
  value?: number[];
  /** Initial thumb values (uncontrolled). Defaults to `[min]`. */
  defaultValue?: number[];
  /** Called on every change while dragging or pressing keys. */
  onValueChange?: (value: number[]) => void;
  /** Called once when a drag or key press ends. */
  onValueCommit?: (value: number[]) => void;
  /** Lowest value. Defaults to 0. */
  min?: number;
  /** Highest value. Defaults to 100. */
  max?: number;
  /** Increment. Defaults to 1. */
  step?: number;
  /** Increment for Page Up / Page Down and Shift+Arrow. Defaults to `step * 10`. */
  largeStep?: number;
  /** Minimum distance between range thumbs, in steps. Defaults to 0. */
  minStepsBetweenThumbs?: number;
  /** Disables the slider. */
  disabled?: boolean;
  /** Form field name; each thumb renders a hidden input (`name` for one thumb, `name[]` for a range). */
  name?: string;
  /**
   * Accessible name of each thumb. For a single slider, `aria-label` / `aria-labelledby` on the root
   * also names the thumb. Defaults to `["Minimum", "Maximum"]` for a range.
   */
  thumbLabels?: string[];
  /** Text read for a value (e.g. `(v) => \`${v} °C\``). */
  getValueText?: (value: number, index: number) => string;
}

const DEFAULT_RANGE_LABELS = ["Minimum", "Maximum"];

/**
 * Pick a value (or a range with two thumbs) on a horizontal track. Each thumb is a `role="slider"`
 * with full keyboard support; the track follows `dir="rtl"`.
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    onValueChange,
    onValueCommit,
    min = 0,
    max = 100,
    step = 1,
    largeStep,
    minStepsBetweenThumbs = 0,
    disabled = false,
    name,
    thumbLabels,
    getValueText,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...props
  },
  ref,
) {
  const [values, setValues] = useControllableState<number[]>(value, defaultValue ?? [min], onValueChange);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const activeThumb = useRef(0);
  const latest = useRef(values);
  latest.current = values;
  const precision = Math.max(decimalsOf(step), decimalsOf(min));
  const range = values.length > 1;
  const gap = minStepsBetweenThumbs * step;

  const snap = (raw: number) => {
    const stepped = Math.round((raw - min) / step) * step + min;
    return clampValue(stepped, min, max, precision);
  };

  const update = (index: number, raw: number) => {
    const prev = latest.current;
    const lower = index > 0 ? (prev[index - 1] ?? min) + gap : min;
    const upper = index < prev.length - 1 ? (prev[index + 1] ?? max) - gap : max;
    const nextValue = Math.min(upper, Math.max(lower, snap(raw)));
    if (nextValue === prev[index]) return prev;
    const next = prev.map((v, i) => (i === index ? nextValue : v));
    latest.current = next;
    setValues(next);
    return next;
  };

  const isRtl = () => (rootRef.current ? getComputedStyle(rootRef.current).direction === "rtl" : false);

  const valueFromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return min;
    const ratio = (isRtl() ? rect.right - clientX : clientX - rect.left) / rect.width;
    return min + Math.min(1, Math.max(0, ratio)) * (max - min);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    const raw = valueFromPointer(event.clientX);
    // Closest thumb; ties go to the thumb that can move toward the pointer.
    let index = 0;
    let best = Number.POSITIVE_INFINITY;
    latest.current.forEach((v, i) => {
      const d = Math.abs(v - raw);
      if (d < best || (d === best && raw > v)) {
        best = d;
        index = i;
      }
    });
    activeThumb.current = index;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    update(index, raw);
    thumbRefs.current[index]?.focus();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || !event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
    update(activeThumb.current, valueFromPointer(event.clientX));
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    onValueCommit?.(latest.current);
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    const big = largeStep ?? step * 10;
    const current = latest.current[index] ?? min;
    const rtl = isRtl();
    const inc = event.shiftKey ? big : step;
    const deltas: Record<string, number> = {
      ArrowUp: inc,
      ArrowDown: -inc,
      ArrowRight: rtl ? -inc : inc,
      ArrowLeft: rtl ? inc : -inc,
      PageUp: big,
      PageDown: -big,
    };
    let target: number | undefined;
    if (event.key in deltas) target = current + (deltas[event.key] ?? 0);
    else if (event.key === "Home") target = min;
    else if (event.key === "End") target = max;
    if (target === undefined) return;
    event.preventDefault();
    const next = update(index, target);
    onValueCommit?.(next);
  };

  const percent = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100);
  const first = values[0] ?? min;
  const last = values[values.length - 1] ?? min;
  const rangeStart = range ? percent(first) : 0;
  const rangeEnd = percent(range ? last : first);

  return (
    <div
      ref={mergeRefs(rootRef, ref)}
      className={cx("mrd-slider", className)}
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      {...props}
    >
      <div
        ref={trackRef}
        className="mrd-slider__track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span
          className="mrd-slider__range"
          style={{ insetInlineStart: `${rangeStart}%`, insetInlineEnd: `${100 - rangeEnd}%` }}
        />
        {values.map((v, index) => {
          const label = range ? (thumbLabels?.[index] ?? DEFAULT_RANGE_LABELS[index]) : thumbLabels?.[0];
          return (
            <span
              key={index}
              ref={(node) => {
                thumbRefs.current[index] = node;
              }}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              className="mrd-slider__thumb"
              style={{ insetInlineStart: `${percent(v)}%` }}
              aria-valuemin={index > 0 && range ? (values[index - 1] ?? min) + gap : min}
              aria-valuemax={index < values.length - 1 ? (values[index + 1] ?? max) - gap : max}
              aria-valuenow={v}
              aria-valuetext={getValueText?.(v, index)}
              aria-orientation="horizontal"
              aria-disabled={disabled || undefined}
              aria-label={label ?? (range ? undefined : ariaLabel)}
              aria-labelledby={label || range ? undefined : ariaLabelledBy}
              onKeyDown={handleKeyDown(index)}
            />
          );
        })}
      </div>
      {name
        ? values.map((v, index) => (
            <input key={index} type="hidden" name={range ? `${name}[]` : name} value={v} disabled={disabled} />
          ))
        : null}
    </div>
  );
});
