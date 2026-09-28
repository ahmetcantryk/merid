"use client";

import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type RefObject,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { composeRefs, useComposedRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { type Placement, useAnchored } from "../../internal/ovl-floating";
import { focusElement } from "../../internal/ovl-focusable";
import { Portal } from "../../internal/ovl-portal";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useDismiss } from "../../internal/ovl-use-dismiss";
import { useFocusTrap } from "../../internal/ovl-use-focus-trap";
import { useId } from "../../internal/ovl-use-id";
import { Slot } from "../../internal/ovl-slot";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover(component: string) {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Popover.Root>.`);
  return ctx;
}

export interface PopoverRootProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Trigger and Content. */
  children?: ReactNode;
}

function PopoverRoot({ open: openProp, defaultOpen = false, onOpenChange, children }: PopoverRootProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const contentId = useId(undefined, "mrd-popover");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const value = useMemo(() => ({ open, setOpen, contentId, triggerRef }), [open, setOpen, contentId]);
  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

export interface PopoverTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the single child element (e.g. your own `Button`) instead of a `<button>`, merging props, ref and handlers. */
  asChild?: boolean;
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

function PopoverTrigger({ asChild = false, onClick, type = "button", ref, ...rest }: PopoverTriggerProps) {
  const ctx = usePopover("Popover.Trigger");
  const Comp = (asChild ? Slot : "button") as "button";
  return (
    <Comp
      ref={composeRefs(ctx.triggerRef, ref)}
      type={asChild ? undefined : type}
      aria-haspopup="dialog"
      aria-expanded={ctx.open}
      aria-controls={ctx.open ? ctx.contentId : undefined}
      data-state={ctx.open ? "open" : "closed"}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.setOpen(!ctx.open);
      }}
      {...rest}
    />
  );
}

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Preferred placement relative to the trigger. Defaults to `"bottom-start"`. */
  placement?: Placement;
  /** Distance from the trigger in px. Defaults to 8. */
  sideOffset?: number;
  /** Accessible name when the content has no visible heading. */
  "aria-label"?: string;
  /** Portal target; defaults to `document.body`. */
  container?: Element | null;
  /** Forwarded ref to the content element. */
  ref?: Ref<HTMLDivElement>;
}

function PopoverContent({
  placement = "bottom-start",
  sideOffset = 8,
  container,
  className,
  style,
  ref,
  ...rest
}: PopoverContentProps) {
  const ctx = usePopover("Popover.Content");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { refs, floatingStyles } = useAnchored({ open: ctx.open, placement, sideOffset });
  useLayoutEffect(() => {
    refs.setReference(ctx.triggerRef.current);
  }, [refs, ctx.triggerRef, ctx.open]);

  useFocusTrap(contentRef, ctx.open, { trap: false, restoreFocus: false });
  useDismiss([contentRef, ctx.triggerRef], ctx.open, (reason) => {
    ctx.setOpen(false);
    if (reason === "escape") focusElement(ctx.triggerRef.current);
  });

  const mergedRef = useComposedRefs(contentRef, refs.setFloating, ref);

  if (!ctx.open) return null;
  return (
    <Portal container={container}>
      <div
        ref={mergedRef}
        id={ctx.contentId}
        role="dialog"
        tabIndex={-1}
        data-state="open"
        className={cx("mrd-popover", className)}
        style={{ ...floatingStyles, ...style }}
        {...rest}
      />
    </Portal>
  );
}

export interface PopoverCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the single child element (e.g. your own `Button`) instead of a `<button>`, merging props, ref and handlers. */
  asChild?: boolean;
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

function PopoverClose({ asChild = false, onClick, type = "button", ...rest }: PopoverCloseProps) {
  const ctx = usePopover("Popover.Close");
  const Comp = (asChild ? Slot : "button") as "button";
  return (
    <Comp
      type={asChild ? undefined : type}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        ctx.setOpen(false);
        focusElement(ctx.triggerRef.current);
      }}
      {...rest}
    />
  );
}

/** Non-modal anchored dialog. Escape or outside press closes it; Escape returns focus to the trigger. */
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
};
