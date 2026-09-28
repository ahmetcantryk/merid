import { type RefObject, useEffect, useRef } from "react";

const layerStack: symbol[] = [];

export type DismissReason = "escape" | "outside";

export interface DismissOptions {
  /** Close on Escape (only the top-most open layer reacts). */
  escape?: boolean;
  /** Close on a pointer press outside every ref. */
  outsidePress?: boolean;
}

/**
 * Calls `onDismiss` on Escape or a pointer press outside `refs` while `active`.
 * Layers stack, so nested overlays close one at a time.
 */
export function useDismiss(
  refs: ReadonlyArray<RefObject<HTMLElement | null>>,
  active: boolean,
  onDismiss: (reason: DismissReason) => void,
  { escape = true, outsidePress = true }: DismissOptions = {},
): void {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    if (!active) return;
    const id = Symbol("layer");
    layerStack.push(id);
    const isTop = () => layerStack[layerStack.length - 1] === id;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!escape || event.key !== "Escape" || !isTop()) return;
      event.preventDefault();
      onDismissRef.current("escape");
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!outsidePress || !isTop()) return;
      const target = event.target as Node | null;
      if (!target) return;
      const inside = refsRef.current.some((ref) => ref.current?.contains(target));
      if (!inside) onDismissRef.current("outside");
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      const index = layerStack.indexOf(id);
      if (index !== -1) layerStack.splice(index, 1);
    };
  }, [active, escape, outsidePress]);
}
