"use client";

import {
  cloneElement,
  type FocusEvent,
  isValidElement,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { composeRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { type Placement, useAnchored } from "../../internal/ovl-floating";
import { Portal } from "../../internal/ovl-portal";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useId } from "../../internal/ovl-use-id";
import { getElementRef } from "../../internal/ovl-with-ref";

type TriggerProps = {
  ref?: Ref<HTMLElement>;
  "aria-describedby"?: string;
  onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
};

export interface TooltipProps {
  /** Tooltip text. Keep it short and non-interactive. */
  content: ReactNode;
  /** A single focusable element (e.g. an icon Button). Receives `aria-describedby`. */
  children: ReactElement;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Hover delay before opening, in ms. Focus opens immediately. Defaults to 400. */
  delay?: number;
  /** Preferred placement. Defaults to `"top"`. */
  placement?: Placement;
  /** Distance from the trigger in px. Defaults to 6. */
  sideOffset?: number;
  /** Class name for the tooltip bubble. */
  className?: string;
  /** Do not show the tooltip. */
  disabled?: boolean;
  /** Portal target; defaults to `document.body` (`null` renders nothing until the target exists). */
  container?: Element | null;
}

/**
 * Tooltip (WAI-ARIA APG "Tooltip"): shows on hover after `delay` and on focus,
 * hides on Escape, blur and pointer leave. Linked with `aria-describedby`.
 */
export function Tooltip({
  content,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  delay = 400,
  placement = "top",
  sideOffset = 6,
  className,
  disabled = false,
  container,
}: TooltipProps) {
  const [openState, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const open = openState && !disabled;
  const id = useId(undefined, "mrd-tooltip");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const triggerRef = useRef<HTMLElement | null>(null);
  const { refs, floatingStyles } = useAnchored({ open, placement, sideOffset });

  useLayoutEffect(() => {
    refs.setReference(triggerRef.current);
  }, [refs, open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  if (!isValidElement<TriggerProps>(children)) return children;
  const childProps = children.props;

  const show = (immediate: boolean) => {
    clearTimeout(timer.current);
    if (immediate) setOpen(true);
    else timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  const trigger = cloneElement(children, {
    ref: composeRefs(triggerRef, getElementRef<HTMLElement>(children)),
    "aria-describedby": cx(childProps["aria-describedby"], open && id) || undefined,
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerEnter?.(event);
      if (event.pointerType !== "touch") show(false);
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerLeave?.(event);
      hide();
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event);
      show(true);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event);
      hide();
    },
  });

  return (
    <>
      {trigger}
      {open ? (
        <Portal container={container} scopeFrom={() => triggerRef.current}>
          <div
            ref={refs.setFloating}
            id={id}
            role="tooltip"
            data-state="open"
            className={cx("mrd-tooltip", className)}
            style={floatingStyles}
          >
            {content}
          </div>
        </Portal>
      ) : null}
    </>
  );
}
