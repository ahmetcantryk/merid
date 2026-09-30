"use client";

import type { VirtualElement } from "@floating-ui/react-dom";
import {
  createContext,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { composeRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { focusElement } from "../../internal/ovl-focusable";
import { Slot } from "../../internal/ovl-slot";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useId } from "../../internal/ovl-use-id";
import { withRef } from "../../internal/ovl-with-ref";
import {
  DropdownMenuCheckboxItem,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuContentProps,
  DropdownMenuGroup,
  type DropdownMenuGroupProps,
  DropdownMenuItem,
  type DropdownMenuItemProps,
  DropdownMenuLabel,
  type DropdownMenuLabelProps,
  DropdownMenuSeparator,
  type DropdownMenuSeparatorProps,
  type FocusTarget,
  MenuContentImpl,
  MenuContext,
  type MenuContextValue,
} from "../dropdown-menu/DropdownMenu";

interface Point {
  x: number;
  y: number;
}

const pointAnchor = ({ x, y }: Point): VirtualElement => ({
  getBoundingClientRect: () => ({ x, y, top: y, left: x, bottom: y, right: x, width: 0, height: 0 }),
});

interface TriggerContextValue {
  openAt: (point: Point) => void;
  triggerRef: RefObject<HTMLElement | null>;
}

const TriggerContext = createContext<TriggerContextValue | null>(null);

export interface ContextMenuRootProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled (the menu then opens against the trigger). */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Accessible name of the menu. Defaults to `"Context menu"`. */
  label?: string;
  /** Trigger and Content. */
  children?: ReactNode;
}

function ContextMenuRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label = "Context menu",
  children,
}: ContextMenuRootProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const menuId = useId(undefined, "mrd-context-menu");
  const triggerRef = useRef<HTMLElement | null>(null);
  const focusTarget = useRef<FocusTarget>("first");
  const pointRef = useRef<Point | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const getAnchor = useCallback(
    () => (pointRef.current ? pointAnchor(pointRef.current) : triggerRef.current),
    [],
  );

  const value = useMemo<MenuContextValue>(
    () => ({
      open,
      setOpen,
      openWith: (target) => {
        focusTarget.current = target;
        setOpen(true);
      },
      close: (returnFocus) => {
        setOpen(false);
        if (returnFocus) focusElement(returnTo.current);
      },
      menuId,
      triggerId: undefined,
      triggerRef,
      focusTarget,
      getAnchor,
      triggerIsInside: false,
      defaultLabel: label,
    }),
    [open, setOpen, menuId, getAnchor, label],
  );

  const trigger = useMemo<TriggerContextValue>(
    () => ({
      triggerRef,
      openAt: (point) => {
        pointRef.current = point;
        const active = document.activeElement as HTMLElement | null;
        returnTo.current = active && active !== document.body ? active : null;
        focusTarget.current = "first";
        setOpen(true);
      },
    }),
    [setOpen],
  );

  return (
    <MenuContext.Provider value={value}>
      <TriggerContext.Provider value={trigger}>{children}</TriggerContext.Provider>
    </MenuContext.Provider>
  );
}

export interface ContextMenuTriggerProps extends HTMLAttributes<HTMLDivElement> {
  /** Render the single child element as the right-click area instead of a `<div>`. */
  asChild?: boolean;
  /** Let the browser's own context menu show instead. */
  disabled?: boolean;
  /** Forwarded ref to the area element. */
  ref?: Ref<HTMLDivElement>;
}

function ContextMenuTrigger({
  asChild = false,
  disabled = false,
  onContextMenu,
  className,
  ref,
  ...rest
}: ContextMenuTriggerProps) {
  const ctx = useContext(TriggerContext);
  if (!ctx) throw new Error("<ContextMenu.Trigger> must be used inside <ContextMenu.Root>.");
  const Comp = (asChild ? Slot : "div") as "div";
  return (
    <Comp
      ref={composeRefs(ctx.triggerRef as RefObject<HTMLDivElement | null>, ref)}
      data-disabled={disabled ? "" : undefined}
      className={cx(asChild ? undefined : "mrd-context-menu__trigger", className)}
      onContextMenu={(event: MouseEvent<HTMLDivElement>) => {
        onContextMenu?.(event);
        if (event.defaultPrevented || disabled) return;
        event.preventDefault();
        // The ContextMenu key and Shift+F10 report no pointer position: anchor below the focused element.
        let point = { x: event.clientX, y: event.clientY };
        if (point.x === 0 && point.y === 0) {
          const rect = (event.target as HTMLElement).getBoundingClientRect();
          point = { x: rect.left, y: rect.bottom };
        }
        ctx.openAt(point);
      }}
      {...rest}
    />
  );
}

export type ContextMenuContentProps = DropdownMenuContentProps;

function ContextMenuContent({ placement = "bottom-start", sideOffset = 2, ...rest }: ContextMenuContentProps) {
  return <MenuContentImpl placement={placement} sideOffset={sideOffset} {...rest} />;
}

export type ContextMenuItemProps = DropdownMenuItemProps;
export type ContextMenuCheckboxItemProps = DropdownMenuCheckboxItemProps;
export type ContextMenuGroupProps = DropdownMenuGroupProps;
export type ContextMenuLabelProps = DropdownMenuLabelProps;
export type ContextMenuSeparatorProps = DropdownMenuSeparatorProps;

/**
 * Context menu (WAI-ARIA APG "Menu"): opens at the pointer on right-click (or the ContextMenu key /
 * Shift+F10 on a focused element inside the trigger) and shares DropdownMenu's items, keyboard model and styles.
 */
export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: withRef("ContextMenu.Trigger", ContextMenuTrigger),
  Content: withRef("ContextMenu.Content", ContextMenuContent),
  Item: withRef("ContextMenu.Item", DropdownMenuItem),
  CheckboxItem: withRef("ContextMenu.CheckboxItem", DropdownMenuCheckboxItem),
  Group: withRef("ContextMenu.Group", DropdownMenuGroup),
  Label: withRef("ContextMenu.Label", DropdownMenuLabel),
  Separator: withRef("ContextMenu.Separator", DropdownMenuSeparator),
};
