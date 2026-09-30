"use client";

import {
  type AnchorHTMLAttributes,
  createContext,
  type FocusEvent,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { composeRefs, useComposedRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { type Placement, useAnchored } from "../../internal/ovl-floating";
import { Portal } from "../../internal/ovl-portal";
import { Slot } from "../../internal/ovl-slot";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useDismiss } from "../../internal/ovl-use-dismiss";
import { useId } from "../../internal/ovl-use-id";
import { withRef } from "../../internal/ovl-with-ref";

interface HoverCardContextValue {
  open: boolean;
  show: () => void;
  hide: () => void;
  cancel: () => void;
  close: () => void;
  contentId: string;
  triggerRef: RefObject<HTMLElement | null>;
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCard(component: string) {
  const ctx = useContext(HoverCardContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <HoverCard.Root>.`);
  return ctx;
}

export interface HoverCardRootProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Delay before opening on hover or focus, in ms. Defaults to 500. */
  openDelay?: number;
  /** Delay before closing after the pointer leaves, in ms. Defaults to 300. */
  closeDelay?: number;
  /** Trigger and Content. */
  children?: ReactNode;
}

function HoverCardRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  openDelay = 500,
  closeDelay = 300,
  children,
}: HoverCardRootProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const contentId = useId(undefined, "mrd-hover-card");
  const triggerRef = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const cancel = useCallback(() => clearTimeout(timer.current), []);
  const show = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), openDelay);
  }, [openDelay, setOpen]);
  const hide = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay, setOpen]);
  const close = useCallback(() => {
    clearTimeout(timer.current);
    setOpen(false);
  }, [setOpen]);

  const value = useMemo<HoverCardContextValue>(
    () => ({ open, show, hide, cancel, close, contentId, triggerRef }),
    [open, show, hide, cancel, close, contentId],
  );
  return <HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>;
}

export interface HoverCardTriggerProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Render the single child element (e.g. your own `Link`) instead of an `<a>`, merging props, ref and handlers. */
  asChild?: boolean;
  /** Forwarded ref to the element. */
  ref?: Ref<HTMLAnchorElement>;
}

function HoverCardTrigger({
  asChild = false,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ref,
  ...rest
}: HoverCardTriggerProps) {
  const ctx = useHoverCard("HoverCard.Trigger");
  const Comp = (asChild ? Slot : "a") as "a";
  return (
    <Comp
      ref={composeRefs(ctx.triggerRef as RefObject<HTMLAnchorElement | null>, ref)}
      data-state={ctx.open ? "open" : "closed"}
      onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
        onPointerEnter?.(event);
        if (!event.defaultPrevented && event.pointerType !== "touch") ctx.show();
      }}
      onPointerLeave={(event: PointerEvent<HTMLAnchorElement>) => {
        onPointerLeave?.(event);
        if (!event.defaultPrevented) ctx.hide();
      }}
      onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
        onFocus?.(event);
        if (!event.defaultPrevented) ctx.show();
      }}
      onBlur={(event: FocusEvent<HTMLAnchorElement>) => {
        onBlur?.(event);
        if (!event.defaultPrevented) ctx.hide();
      }}
      {...rest}
    />
  );
}

export interface HoverCardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Preferred placement relative to the trigger. Defaults to `"bottom"`. */
  placement?: Placement;
  /** Distance from the trigger in px. Defaults to 8. */
  sideOffset?: number;
  /** Portal target; defaults to `document.body`. */
  container?: Element | null;
  /** Forwarded ref to the content element. */
  ref?: Ref<HTMLDivElement>;
}

function HoverCardContent({
  placement = "bottom",
  sideOffset = 8,
  container,
  className,
  style,
  onPointerEnter,
  onPointerLeave,
  ref,
  ...rest
}: HoverCardContentProps) {
  const ctx = useHoverCard("HoverCard.Content");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { refs, floatingStyles } = useAnchored({ open: ctx.open, placement, sideOffset });
  useLayoutEffect(() => {
    refs.setReference(ctx.triggerRef.current);
  }, [refs, ctx.triggerRef, ctx.open]);
  useDismiss([contentRef, ctx.triggerRef], ctx.open, ctx.close);
  const mergedRef = useComposedRefs(contentRef, refs.setFloating, ref);

  if (!ctx.open) return null;
  return (
    <Portal container={container} scopeFrom={() => ctx.triggerRef.current}>
      <div
        ref={mergedRef}
        id={ctx.contentId}
        data-state="open"
        className={cx("mrd-hover-card", className)}
        style={{ ...floatingStyles, ...style }}
        onPointerEnter={(event: PointerEvent<HTMLDivElement>) => {
          onPointerEnter?.(event);
          if (!event.defaultPrevented) ctx.cancel();
        }}
        onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
          onPointerLeave?.(event);
          if (!event.defaultPrevented) ctx.hide();
        }}
        {...rest}
      />
    </Portal>
  );
}

/**
 * Preview card for sighted pointer and keyboard users, shown after a hover or focus delay.
 * It is supplementary: the trigger must make sense on its own, since the card is not announced.
 */
export const HoverCard = {
  Root: HoverCardRoot,
  Trigger: withRef("HoverCard.Trigger", HoverCardTrigger),
  Content: withRef("HoverCard.Content", HoverCardContent),
};
