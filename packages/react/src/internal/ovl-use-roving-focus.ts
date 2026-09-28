"use client";

import { type KeyboardEvent as ReactKeyboardEvent, type RefObject, useCallback, useRef } from "react";

export type Orientation = "horizontal" | "vertical";

/** Attribute marking an item of a roving group. Disabled items also carry `data-disabled`. */
export const ROVING_ITEM = "[data-mrd-roving]";

export interface RovingFocusOptions {
  /** Which arrow keys move focus. */
  orientation?: Orientation | "both";
  /** Wrap from last to first and back. */
  loop?: boolean;
  /** Enable single-character typeahead (matches `data-text-value` or text content). */
  typeahead?: boolean;
  /** Called after focus moves to an item. */
  onMove?: (item: HTMLElement) => void;
}

/** Enabled roving items inside `container`, in DOM order. */
export function getRovingItems(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(ROVING_ITEM)).filter(
    (el) => !el.hasAttribute("data-disabled"),
  );
}

const itemText = (el: HTMLElement) => (el.dataset.textValue ?? el.textContent ?? "").trim().toLowerCase();

/** Pure typeahead search: first item after `from` (wrapping) whose text starts with `query`. */
export function findTypeaheadMatch<T>(
  items: readonly T[],
  from: number,
  query: string,
  text: (item: T) => string,
): T | undefined {
  const start = query.length > 1 ? Math.max(from, 0) : from + 1;
  const ordered = [...items.slice(start), ...items.slice(0, start)];
  return ordered.find((item) => text(item).startsWith(query));
}

/** Returns a keydown handler for arrow / Home / End / typeahead movement across roving items. */
export function useRovingFocus(
  containerRef: RefObject<HTMLElement | null>,
  { orientation = "vertical", loop = true, typeahead = false, onMove }: RovingFocusOptions = {},
): (event: ReactKeyboardEvent) => void {
  const buffer = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return useCallback(
    (event: ReactKeyboardEvent) => {
      const items = getRovingItems(containerRef.current);
      if (items.length === 0) return;
      const index = items.indexOf(document.activeElement as HTMLElement);
      const horizontal = orientation !== "vertical";
      const vertical = orientation !== "horizontal";
      // Horizontal arrows follow reading direction: in RTL, ArrowLeft moves forward.
      const container = containerRef.current;
      const rtl = horizontal && container !== null && getComputedStyle(container).direction === "rtl";
      const forwardKey = rtl ? "ArrowLeft" : "ArrowRight";
      const backKey = rtl ? "ArrowRight" : "ArrowLeft";
      const isNext = (vertical && event.key === "ArrowDown") || (horizontal && event.key === forwardKey);
      const isPrev = (vertical && event.key === "ArrowUp") || (horizontal && event.key === backKey);
      let target: HTMLElement | undefined;

      if (isNext) {
        const n = index + 1;
        target = n >= items.length ? (loop ? items[0] : items[items.length - 1]) : items[n];
      } else if (isPrev) {
        const p = index - 1;
        target = p < 0 ? (loop ? items[items.length - 1] : items[0]) : items[p];
      } else if (event.key === "Home") {
        target = items[0];
      } else if (event.key === "End") {
        target = items[items.length - 1];
      } else if (typeahead && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        clearTimeout(timer.current);
        buffer.current += event.key.toLowerCase();
        timer.current = setTimeout(() => {
          buffer.current = "";
        }, 500);
        target = findTypeaheadMatch(items, index, buffer.current, itemText);
        if (!target) return;
      } else {
        return;
      }

      event.preventDefault();
      if (target) {
        target.focus();
        onMove?.(target);
      }
    },
    [containerRef, orientation, loop, typeahead, onMove],
  );
}
