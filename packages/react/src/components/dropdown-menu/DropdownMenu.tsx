"use client";

import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  useContext,
  useEffect,
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
import { useId } from "../../internal/ovl-use-id";
import { getRovingItems, useRovingFocus } from "../../internal/ovl-use-roving-focus";
import { Slot } from "../../internal/ovl-slot";
import { withRef } from "../../internal/ovl-with-ref";

type FocusTarget = "first" | "last";

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openWith: (target: FocusTarget) => void;
  close: (returnFocus: boolean) => void;
  menuId: string;
  triggerId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  focusTarget: RefObject<FocusTarget>;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenu(component: string) {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <DropdownMenu.Root>.`);
  return ctx;
}

export interface DropdownMenuRootProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Trigger and Content. */
  children?: ReactNode;
}

function DropdownMenuRoot({ open: openProp, defaultOpen = false, onOpenChange, children }: DropdownMenuRootProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const menuId = useId(undefined, "mrd-menu");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const focusTarget = useRef<FocusTarget>("first");
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
        if (returnFocus) focusElement(triggerRef.current);
      },
      menuId,
      triggerId: `${menuId}-trigger`,
      triggerRef,
      focusTarget,
    }),
    [open, setOpen, menuId],
  );
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export interface DropdownMenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the single child element (e.g. your own `Button`) instead of a `<button>`, merging props, ref and handlers. */
  asChild?: boolean;
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

function DropdownMenuTrigger({ asChild = false, onClick, onKeyDown, type = "button", ref, ...rest }: DropdownMenuTriggerProps) {
  const ctx = useMenu("DropdownMenu.Trigger");
  const Comp = (asChild ? Slot : "button") as "button";
  return (
    <Comp
      ref={composeRefs(ctx.triggerRef, ref)}
      id={ctx.triggerId}
      type={asChild ? undefined : type}
      aria-haspopup="menu"
      aria-expanded={ctx.open}
      aria-controls={ctx.open ? ctx.menuId : undefined}
      data-state={ctx.open ? "open" : "closed"}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (ctx.open) ctx.close(false);
        else ctx.openWith("first");
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          ctx.openWith("first");
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          ctx.openWith("last");
        }
      }}
      {...rest}
    />
  );
}

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Preferred placement. Defaults to `"bottom-start"`. */
  placement?: Placement;
  /** Distance from the trigger in px. Defaults to 6. */
  sideOffset?: number;
  /** Portal target; defaults to `document.body`. */
  container?: Element | null;
  /** Forwarded ref to the menu element. */
  ref?: Ref<HTMLDivElement>;
}

function DropdownMenuContent({
  placement = "bottom-start",
  sideOffset = 6,
  container,
  className,
  style,
  onKeyDown,
  ref,
  ...rest
}: DropdownMenuContentProps) {
  const ctx = useMenu("DropdownMenu.Content");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { refs, floatingStyles } = useAnchored({ open: ctx.open, placement, sideOffset });
  const roving = useRovingFocus(menuRef, { orientation: "vertical", loop: true, typeahead: true });

  useLayoutEffect(() => {
    refs.setReference(ctx.triggerRef.current);
  }, [refs, ctx.triggerRef, ctx.open]);

  useEffect(() => {
    if (!ctx.open) return;
    const items = getRovingItems(menuRef.current);
    const target = ctx.focusTarget.current === "last" ? items[items.length - 1] : items[0];
    focusElement(target ?? menuRef.current);
  }, [ctx.open, ctx.focusTarget]);

  useDismiss([menuRef, ctx.triggerRef], ctx.open, (reason) => ctx.close(reason === "escape"));

  const mergedRef = useComposedRefs(menuRef, refs.setFloating, ref);

  if (!ctx.open) return null;
  return (
    <Portal container={container} scopeFrom={() => ctx.triggerRef.current}>
      <div
        ref={mergedRef}
        id={ctx.menuId}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={ctx.triggerId}
        tabIndex={-1}
        data-state="open"
        className={cx("mrd-menu", className)}
        style={{ ...floatingStyles, ...style }}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === "Tab") {
            ctx.close(false);
            return;
          }
          roving(event);
        }}
        {...rest}
      />
    </Portal>
  );
}

interface ItemBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Disable the item; it is skipped by arrow keys. */
  disabled?: boolean;
  /** Text used for typeahead when children are not plain text. */
  textValue?: string;
  /** Icon or element shown before the label. */
  leading?: ReactNode;
  /** Shortcut hint or element shown after the label. */
  trailing?: ReactNode;
  /** Forwarded ref to the item element. */
  ref?: Ref<HTMLDivElement>;
}

type ItemHandlers = Pick<HTMLAttributes<HTMLDivElement>, "onClick" | "onKeyDown" | "onPointerMove">;

/** Internal item behaviour composed after the consumer handlers; `preventDefault()` in a consumer handler skips it. */
function useItemActivation(disabled: boolean, activate: () => void, user: ItemHandlers) {
  return {
    onClick: (event: MouseEvent<HTMLDivElement>) => {
      user.onClick?.(event);
      if (event.defaultPrevented) return;
      if (disabled) {
        event.preventDefault();
        return;
      }
      activate();
    },
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      user.onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (!disabled) activate();
    },
    onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => {
      user.onPointerMove?.(event);
      if (event.defaultPrevented) return;
      if (!disabled && document.activeElement !== event.currentTarget) event.currentTarget.focus();
    },
  };
}

export interface DropdownMenuItemProps extends ItemBaseProps {
  /** Called when the item is chosen by click, Enter or Space. Call `preventDefault` to keep the menu open. */
  onSelect?: (event: Event) => void;
}

function DropdownMenuItem({
  disabled = false,
  textValue,
  leading,
  trailing,
  onSelect,
  onClick,
  onKeyDown,
  onPointerMove,
  className,
  children,
  ...rest
}: DropdownMenuItemProps) {
  const ctx = useMenu("DropdownMenu.Item");
  const handlers = useItemActivation(disabled, () => {
    const event = new Event("mrd.select", { cancelable: true });
    onSelect?.(event);
    if (!event.defaultPrevented) ctx.close(true);
  }, { onClick, onKeyDown, onPointerMove });
  return (
    <div
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "" : undefined}
      data-mrd-roving=""
      data-text-value={textValue}
      className={cx("mrd-menu__item", className)}
      {...rest}
      {...handlers}
    >
      {leading ? <span className="mrd-menu__leading" aria-hidden="true">{leading}</span> : null}
      <span className="mrd-menu__label-text">{children}</span>
      {trailing ? <span className="mrd-menu__trailing">{trailing}</span> : null}
    </div>
  );
}

export interface DropdownMenuCheckboxItemProps extends ItemBaseProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new checked state. The menu stays open. */
  onCheckedChange?: (checked: boolean) => void;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 7.5l2.5 2.5L11 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DropdownMenuCheckboxItem({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  textValue,
  trailing,
  onClick,
  onKeyDown,
  onPointerMove,
  className,
  children,
  ...rest
}: DropdownMenuCheckboxItemProps) {
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const handlers = useItemActivation(disabled, () => setChecked(!checked), { onClick, onKeyDown, onPointerMove });
  return (
    <div
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "" : undefined}
      data-state={checked ? "checked" : "unchecked"}
      data-mrd-roving=""
      data-text-value={textValue}
      className={cx("mrd-menu__item", className)}
      {...rest}
      {...handlers}
    >
      <span className="mrd-menu__check" aria-hidden="true">{checked ? <CheckIcon /> : null}</span>
      <span className="mrd-menu__label-text">{children}</span>
      {trailing ? <span className="mrd-menu__trailing">{trailing}</span> : null}
    </div>
  );
}

export interface DropdownMenuGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible group name; pair with a `DropdownMenu.Label` via `aria-labelledby` or pass it here. */
  "aria-label"?: string;
}

function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  return <div role="group" {...props} />;
}

export interface DropdownMenuLabelProps extends HTMLAttributes<HTMLDivElement> {}

function DropdownMenuLabel({ className, ...rest }: DropdownMenuLabelProps) {
  return <div role="presentation" className={cx("mrd-menu__label", className)} {...rest} />;
}

export interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

function DropdownMenuSeparator({ className, ...rest }: DropdownMenuSeparatorProps) {
  return <div role="separator" className={cx("mrd-menu__separator", className)} {...rest} />;
}

/**
 * Menu button (WAI-ARIA APG "Menu Button"): Enter/Space/ArrowDown open on the first item,
 * ArrowUp on the last; ArrowUp/Down/Home/End and typeahead move; Escape closes and returns focus.
 */
export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: withRef("DropdownMenu.Trigger", DropdownMenuTrigger),
  Content: withRef("DropdownMenu.Content", DropdownMenuContent),
  Item: withRef("DropdownMenu.Item", DropdownMenuItem),
  CheckboxItem: withRef("DropdownMenu.CheckboxItem", DropdownMenuCheckboxItem),
  Group: withRef("DropdownMenu.Group", DropdownMenuGroup),
  Label: withRef("DropdownMenu.Label", DropdownMenuLabel),
  Separator: withRef("DropdownMenu.Separator", DropdownMenuSeparator),
};
