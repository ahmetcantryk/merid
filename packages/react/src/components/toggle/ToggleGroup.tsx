"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/merge-refs";
import { useControllableState } from "../../utils/use-controllable";
import type { ToggleSize } from "./Toggle";

interface ToggleGroupContextValue {
  isOn: (value: string) => boolean;
  toggle: (value: string) => void;
  size: ToggleSize;
  disabled: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

interface ToggleGroupBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Size of every item. Defaults to `"md"`. */
  size?: ToggleSize;
  /** Which arrow keys move focus. Defaults to `"horizontal"`. */
  orientation?: "horizontal" | "vertical";
  /** Disables every item. */
  disabled?: boolean;
}

export interface ToggleGroupSingleProps extends ToggleGroupBaseProps {
  /** One item can be on at a time; pressing it again turns it off. */
  type: "single";
  /** Pressed value (controlled); `""` means none. */
  value?: string;
  /** Initially pressed value (uncontrolled). */
  defaultValue?: string;
  /** Called with the new value (`""` when turned off). */
  onValueChange?: (value: string) => void;
}

export interface ToggleGroupMultipleProps extends ToggleGroupBaseProps {
  /** Any number of items can be on. */
  type: "multiple";
  /** Pressed values (controlled). */
  value?: string[];
  /** Initially pressed values (uncontrolled). */
  defaultValue?: string[];
  /** Called with the new list of pressed values. */
  onValueChange?: (value: string[]) => void;
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

const ITEM = "[data-mrd-toggle-item]";

function toList(value: string | string[] | undefined): string[] {
  if (value === undefined || value === "") return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * A set of toggle buttons with one tab stop (roving focus). `type="single"` behaves like a
 * deselectable radio set, `type="multiple"` like independent toggles. Name it with `aria-label`.
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(props, ref) {
  const {
    type,
    value,
    defaultValue,
    onValueChange,
    size = "md",
    orientation = "horizontal",
    disabled = false,
    className,
    onKeyDown,
    onFocus,
    children,
    ...rest
  } = props;
  const [current, setCurrent] = useControllableState<string[]>(
    value === undefined ? undefined : toList(value),
    toList(defaultValue),
    (next) => {
      if (type === "single") (onValueChange as ((v: string) => void) | undefined)?.(next[0] ?? "");
      else (onValueChange as ((v: string[]) => void) | undefined)?.(next);
    },
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const ctx = useMemo<ToggleGroupContextValue>(
    () => ({
      isOn: (v) => current.includes(v),
      toggle: (v) => {
        if (type === "single") setCurrent(current.includes(v) ? [] : [v]);
        else setCurrent(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
      },
      size,
      disabled,
    }),
    [current, setCurrent, type, size, disabled],
  );

  // Roving tab stop: the last focused item, else the first pressed item, else the first enabled item.
  useLayoutEffect(() => {
    const items = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>(ITEM) ?? []);
    const enabled = items.filter((el) => !el.disabled);
    const focused = lastFocused.current;
    const stop =
      (focused && enabled.includes(focused as HTMLButtonElement) ? focused : undefined) ??
      enabled.find((el) => el.getAttribute("aria-pressed") === "true") ??
      enabled[0];
    for (const el of items) el.tabIndex = el === stop ? 0 : -1;
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !rootRef.current) return;
    const items = Array.from(rootRef.current.querySelectorAll<HTMLButtonElement>(ITEM)).filter((el) => !el.disabled);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const rtl = getComputedStyle(rootRef.current).direction === "rtl";
    const nextKey = orientation === "horizontal" ? (rtl ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
    const prevKey = orientation === "horizontal" ? (rtl ? "ArrowRight" : "ArrowLeft") : "ArrowUp";
    let target: number | null = null;
    if (event.key === nextKey) target = (index + 1) % items.length;
    else if (event.key === prevKey) target = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = items.length - 1;
    if (target === null) return;
    event.preventDefault();
    items[target]?.focus();
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event);
    const target = event.target as HTMLElement;
    if (!target.matches(ITEM)) return;
    lastFocused.current = target;
    for (const el of rootRef.current?.querySelectorAll<HTMLElement>(ITEM) ?? []) el.tabIndex = el === target ? 0 : -1;
  };

  return (
    <ToggleGroupContext.Provider value={ctx}>
      <div
        ref={mergeRefs(rootRef, ref)}
        role="group"
        aria-disabled={disabled || undefined}
        data-orientation={orientation}
        className={cx("mrd-toggle-group", className)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...rest}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
});

export interface ToggleGroupItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Value reported when this item is on. */
  value: string;
}

/** One toggle button inside a `ToggleGroup`. Icon-only items need an `aria-label`. */
export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(function ToggleGroupItem(
  { value, className, disabled, onClick, ...props },
  ref,
) {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error("<ToggleGroupItem> must be used inside <ToggleGroup>.");
  const on = ctx.isOn(value);
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={on}
      data-state={on ? "on" : "off"}
      data-size={ctx.size}
      data-mrd-toggle-item=""
      disabled={ctx.disabled || disabled}
      className={cx("mrd-toggle", "mrd-toggle-group__item", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.toggle(value);
      }}
      {...props}
    />
  );
});
