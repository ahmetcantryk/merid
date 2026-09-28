/** Joins truthy class names with a single space. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Merges several event handlers; a later one is skipped if an earlier one called preventDefault(). */
export function composeHandlers<E extends { defaultPrevented: boolean }>(
  ...handlers: Array<((event: E) => void) | undefined>
): (event: E) => void {
  return (event) => {
    for (const handler of handlers) {
      if (event.defaultPrevented) return;
      handler?.(event);
    }
  };
}

/** Joins space-separated id lists (e.g. aria-describedby), dropping empties. */
export function joinIds(...ids: Array<string | undefined | false>): string | undefined {
  const joined = ids.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}
