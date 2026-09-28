const TABBABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "[contenteditable='true']",
  "[tabindex]",
].join(",");

/** Tabbable descendants of `root`, in DOM order. */
export function getTabbables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) => el.tabIndex >= 0 && !el.closest("[hidden],[inert]"),
  );
}

/** Focuses without scrolling. */
export function focusElement(el: HTMLElement | null | undefined): void {
  el?.focus({ preventScroll: true });
}
