/** Keys that move selection in a radio-like group, mapped to a direction. */
const KEY_DIRECTION: Record<string, 1 | -1 | "first" | "last"> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
  Home: "first",
  End: "last",
};

/**
 * Given the enabled items and the currently focused index, returns the index that
 * a key press should move to, or `null` when the key is not a navigation key.
 * Wraps around at both ends (WAI-ARIA APG radio group pattern).
 */
export function nextRovingIndex(key: string, currentIndex: number, count: number, rtl = false): number | null {
  const direction = KEY_DIRECTION[key];
  if (direction === undefined || count === 0) return null;
  if (direction === "first") return 0;
  if (direction === "last") return count - 1;
  const horizontal = key === "ArrowLeft" || key === "ArrowRight";
  const step = horizontal && rtl ? -direction : direction;
  return (currentIndex + step + count) % count;
}
