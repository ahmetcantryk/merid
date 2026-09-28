"use client";

import { type RefObject, useEffect } from "react";
import { focusElement, getTabbables } from "./ovl-focusable";

export interface FocusTrapOptions {
  /** Keep Tab inside the container (modal). When false only initial focus and restore apply. */
  trap?: boolean;
  /** Return focus to the previously focused element on deactivate. */
  restoreFocus?: boolean;
  /** Element to focus on activate; defaults to `[data-autofocus]`, first tabbable, then the container. */
  initialFocus?: RefObject<HTMLElement | null> | undefined;
}

/** Moves focus into `containerRef` while `active`, optionally trapping Tab, and restores it afterwards. */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  { trap = true, restoreFocus = true, initialFocus }: FocusTrapOptions = {},
): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;
    const previous = document.activeElement as HTMLElement | null;

    focusElement(
      initialFocus?.current ??
        container.querySelector<HTMLElement>("[data-autofocus]") ??
        getTabbables(container)[0] ??
        container,
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (!trap || event.key !== "Tab") return;
      const items = getTabbables(container);
      if (items.length === 0) {
        event.preventDefault();
        focusElement(container);
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      const outside = !container.contains(current);
      if (event.shiftKey && (current === first || current === container || outside)) {
        event.preventDefault();
        focusElement(last);
      } else if (!event.shiftKey && (current === last || outside)) {
        event.preventDefault();
        focusElement(first);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (restoreFocus && previous?.isConnected) focusElement(previous);
    };
  }, [active, containerRef, trap, restoreFocus, initialFocus]);
}
