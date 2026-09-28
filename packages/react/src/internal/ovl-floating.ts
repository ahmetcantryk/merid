import { autoUpdate, flip, offset, type Placement, shift, size, useFloating } from "@floating-ui/react-dom";

export type { Placement };

export interface AnchoredOptions {
  open: boolean;
  placement?: Placement;
  /** Gap between anchor and floating element in px. */
  sideOffset?: number;
  /** Make the floating element at least as wide as its anchor. */
  matchWidth?: boolean;
}

/** Floating UI positioning shared by Popover, Tooltip, DropdownMenu and Select. */
export function useAnchored({ open, placement = "bottom-start", sideOffset = 8, matchWidth = false }: AnchoredOptions) {
  return useFloating({
    open,
    placement,
    strategy: "fixed",
    whileElementsMounted: (reference, floating, update) =>
      typeof ResizeObserver === "undefined" ? () => undefined : autoUpdate(reference, floating, update),
    middleware: [
      offset(sideOffset),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      ...(matchWidth
        ? [
            size({
              apply({ rects, elements }) {
                elements.floating.style.minWidth = `${rects.reference.width}px`;
              },
            }),
          ]
        : []),
    ],
  });
}
