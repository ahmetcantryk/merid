"use client";

import { type CSSProperties, type HTMLAttributes, type Ref, useLayoutEffect, useRef, useState } from "react";
import { useComposedRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { getTabbables } from "../../internal/ovl-focusable";
import { withRef } from "../../internal/ovl-with-ref";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Which axes scroll. Defaults to `"vertical"`. */
  orientation?: ScrollAreaOrientation;
  /** Maximum block size (height) before it scrolls, e.g. `240` or `"50vh"`. */
  maxHeight?: CSSProperties["maxHeight"];
  /** Show the thin scrollbar only while hovered or focused (fine pointers). Defaults to false. */
  autoHide?: boolean;
  /**
   * Accessible name of the scroll region. When the content overflows and holds nothing focusable,
   * the area becomes a focusable `role="region"` with this name so keyboard users can scroll it.
   * Defaults to `"Scrollable content"`.
   */
  label?: string;
  /** Forwarded ref to the scrolling element. */
  ref?: Ref<HTMLDivElement>;
}

function overflows(el: HTMLElement, orientation: ScrollAreaOrientation) {
  const y = el.scrollHeight > el.clientHeight + 1;
  const x = el.scrollWidth > el.clientWidth + 1;
  if (orientation === "vertical") return y;
  if (orientation === "horizontal") return x;
  return x || y;
}

/**
 * A native scroll container with thin, token-coloured scrollbars. Scrolling stays native (wheel,
 * touch, keyboard, find-in-page, scroll anchoring); nothing is re-implemented in JavaScript.
 */
function ScrollAreaImpl({
  orientation = "vertical",
  maxHeight,
  autoHide = false,
  label = "Scrollable content",
  className,
  style,
  tabIndex,
  ref,
  ...rest
}: ScrollAreaProps) {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const [focusable, setFocusable] = useState(false);

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return undefined;
    const update = () => setFocusable(overflows(el, orientation) && getTabbables(el).length === 0);
    update();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [orientation]);

  const mergedRef = useComposedRefs(areaRef, ref);
  const region = focusable ? { role: "region", "aria-label": label, tabIndex: tabIndex ?? 0 } : { tabIndex };

  return (
    <div
      ref={mergedRef}
      className={cx("mrd-scroll-area", className)}
      data-orientation={orientation}
      data-autohide={autoHide || undefined}
      style={maxHeight === undefined ? style : { maxHeight, ...style }}
      {...region}
      {...rest}
    />
  );
}

export const ScrollArea = withRef("ScrollArea", ScrollAreaImpl);
