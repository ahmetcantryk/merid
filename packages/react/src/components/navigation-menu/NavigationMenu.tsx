"use client";

import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  createContext,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type LiHTMLAttributes,
  type PointerEvent,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { composeRefs, useComposedRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { focusElement, getTabbables } from "../../internal/ovl-focusable";
import { Slot } from "../../internal/ovl-slot";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useDismiss } from "../../internal/ovl-use-dismiss";
import { useId } from "../../internal/ovl-use-id";
import { withRef } from "../../internal/ovl-with-ref";

interface RootContextValue {
  value: string;
  setValue: (value: string) => void;
  openDelayed: (value: string) => void;
  closeDelayed: () => void;
  cancelTimer: () => void;
  openedByHoverRecently: () => boolean;
  baseId: string;
  rootRef: RefObject<HTMLElement | null>;
}

const RootContext = createContext<RootContextValue | null>(null);

interface ItemContextValue {
  value: string;
  open: boolean;
  triggerId: string;
  contentId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
}

const ItemContext = createContext<ItemContextValue | null>(null);
const PanelContext = createContext(false);

function useRoot(component: string) {
  const ctx = useContext(RootContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <NavigationMenu.Root>.`);
  return ctx;
}

function useItem(component: string) {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <NavigationMenu.Item>.`);
  return ctx;
}

/** ms after a hover-open during which a click on the same trigger keeps the panel open. */
const HOVER_CLICK_GRACE = 600;

/** Top-level focusable entries (triggers and links directly in an item). */
const TOP_LEVEL = "[data-mrd-navmenu-top]";

export interface NavigationMenuRootProps extends Omit<HTMLAttributes<HTMLElement>, "defaultValue"> {
  /** Controlled open item value (`""` when none is open). */
  value?: string;
  /** Initially open item when uncontrolled. */
  defaultValue?: string;
  /** Called with the open item value (`""` when all close). */
  onValueChange?: (value: string) => void;
  /** Hover delay before a panel opens, in ms. Defaults to 150. Clicks and keys open at once. */
  openDelay?: number;
  /** Delay before a panel closes after the pointer leaves, in ms. Defaults to 250. */
  closeDelay?: number;
  /** Accessible name of the `<nav>` landmark. Defaults to `"Main"`. */
  "aria-label"?: string;
  /** Forwarded ref to the `<nav>`. */
  ref?: Ref<HTMLElement>;
}

function NavigationMenuRoot({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  openDelay = 150,
  closeDelay = 250,
  "aria-label": ariaLabel = "Main",
  className,
  onBlur,
  ref,
  ...rest
}: NavigationMenuRootProps) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const baseId = useId(undefined, "mrd-navmenu");
  const rootRef = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const cancelTimer = useCallback(() => clearTimeout(timer.current), []);
  const hoverOpenedAt = useRef(0);
  const openDelayed = useCallback(
    (next: string) => {
      clearTimeout(timer.current);
      const open = () => {
        hoverOpenedAt.current = Date.now();
        setValue(next);
      };
      // Moving between items while one is open switches immediately.
      if (value !== "") open();
      else timer.current = setTimeout(open, openDelay);
    },
    [value, setValue, openDelay],
  );
  // A click that lands right after hover opened the panel should not close it again.
  const openedByHoverRecently = useCallback(() => Date.now() - hoverOpenedAt.current < HOVER_CLICK_GRACE, []);
  const closeDelayed = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setValue(""), closeDelay);
  }, [setValue, closeDelay]);

  useDismiss([rootRef], value !== "", (reason) => {
    const open = value;
    setValue("");
    if (reason === "escape") {
      const triggers = rootRef.current?.querySelectorAll<HTMLElement>("[data-mrd-navmenu-value]") ?? [];
      focusElement(Array.from(triggers).find((el) => el.dataset.mrdNavmenuValue === open));
    }
  });

  const ctx = useMemo<RootContextValue>(
    () => ({ value, setValue, openDelayed, closeDelayed, cancelTimer, openedByHoverRecently, baseId, rootRef }),
    [value, setValue, openDelayed, closeDelayed, cancelTimer, openedByHoverRecently, baseId],
  );
  const mergedRef = useComposedRefs(rootRef, ref);

  return (
    <RootContext.Provider value={ctx}>
      <nav
        ref={mergedRef}
        aria-label={ariaLabel}
        className={cx("mrd-navmenu", className)}
        data-state={value ? "open" : "closed"}
        onBlur={(event: FocusEvent<HTMLElement>) => {
          onBlur?.(event);
          const next = event.relatedTarget as Node | null;
          if (next && !event.currentTarget.contains(next)) setValue("");
        }}
        {...rest}
      />
    </RootContext.Provider>
  );
}

export interface NavigationMenuListProps extends HTMLAttributes<HTMLUListElement> {
  /** Forwarded ref to the `<ul>`. */
  ref?: Ref<HTMLUListElement>;
}

function NavigationMenuList({ className, onKeyDown, ...rest }: NavigationMenuListProps) {
  useRoot("NavigationMenu.List");
  return (
    <ul
      className={cx("mrd-navmenu__list", className)}
      onKeyDown={(event: KeyboardEvent<HTMLUListElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const target = event.target as HTMLElement;
        if (!target.matches(TOP_LEVEL)) return;
        const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(TOP_LEVEL));
        const index = items.indexOf(target);
        const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
        const forward = rtl ? "ArrowLeft" : "ArrowRight";
        const back = rtl ? "ArrowRight" : "ArrowLeft";
        let next: HTMLElement | undefined;
        if (event.key === forward) next = items[(index + 1) % items.length];
        else if (event.key === back) next = items[(index - 1 + items.length) % items.length];
        else if (event.key === "Home") next = items[0];
        else if (event.key === "End") next = items[items.length - 1];
        if (!next) return;
        event.preventDefault();
        next.focus();
      }}
      {...rest}
    />
  );
}

export interface NavigationMenuItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /** Unique value; required when the item has a Trigger and Content. Defaults to a generated id. */
  value?: string;
  /** Forwarded ref to the `<li>`. */
  ref?: Ref<HTMLLIElement>;
}

function NavigationMenuItem({ value: valueProp, className, ...rest }: NavigationMenuItemProps) {
  const root = useRoot("NavigationMenu.Item");
  const generated = useId(undefined, "item");
  const value = valueProp ?? generated;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const key = encodeURIComponent(value).replace(/%/g, "_");
  const open = root.value === value;
  const item = useMemo<ItemContextValue>(
    () => ({
      value,
      open,
      triggerId: `${root.baseId}-trigger-${key}`,
      contentId: `${root.baseId}-content-${key}`,
      triggerRef,
      contentRef,
    }),
    [value, open, root.baseId, key],
  );
  return (
    <ItemContext.Provider value={item}>
      <li className={cx("mrd-navmenu__item", className)} data-state={open ? "open" : "closed"} {...rest} />
    </ItemContext.Provider>
  );
}

function Chevron() {
  return (
    <svg className="mrd-navmenu__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 4.5L6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface NavigationMenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

function NavigationMenuTrigger({
  className,
  children,
  onClick,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  ref,
  ...rest
}: NavigationMenuTriggerProps) {
  const root = useRoot("NavigationMenu.Trigger");
  const item = useItem("NavigationMenu.Trigger");
  return (
    <button
      ref={composeRefs(item.triggerRef, ref)}
      type="button"
      id={item.triggerId}
      aria-expanded={item.open}
      aria-controls={item.contentId}
      data-state={item.open ? "open" : "closed"}
      data-mrd-navmenu-top=""
      data-mrd-navmenu-value={item.value}
      className={cx("mrd-navmenu__trigger", className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        root.cancelTimer();
        // event.detail is 0 for keyboard-generated clicks, which always toggle.
        if (item.open && event.detail > 0 && root.openedByHoverRecently()) return;
        root.setValue(item.open ? "" : item.value);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== "ArrowDown") return;
        event.preventDefault();
        root.cancelTimer();
        root.setValue(item.value);
        // Content renders hidden while closed, so it is in the DOM: focus its first link after the state flush.
        requestAnimationFrame(() => focusElement(item.contentRef.current ? getTabbables(item.contentRef.current)[0] : null));
      }}
      onPointerEnter={(event: PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(event);
        if (!event.defaultPrevented && event.pointerType !== "touch") root.openDelayed(item.value);
      }}
      onPointerLeave={(event: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(event);
        if (!event.defaultPrevented && event.pointerType !== "touch") root.closeDelayed();
      }}
      {...rest}
    >
      {children}
      <Chevron />
    </button>
  );
}

export interface NavigationMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Span the full width of the menu bar (a mega menu) instead of sizing to the content. */
  fullWidth?: boolean;
  /** Forwarded ref to the panel. */
  ref?: Ref<HTMLDivElement>;
}

function NavigationMenuContent({
  fullWidth = false,
  className,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  ref,
  ...rest
}: NavigationMenuContentProps) {
  const root = useRoot("NavigationMenu.Content");
  const item = useItem("NavigationMenu.Content");
  return (
    <PanelContext.Provider value={true}>
    <div
      ref={composeRefs(item.contentRef, ref)}
      id={item.contentId}
      aria-labelledby={item.triggerId}
      hidden={!item.open}
      data-state={item.open ? "open" : "closed"}
      data-full={fullWidth || undefined}
      className={cx("mrd-navmenu__content", className)}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        const links = getTabbables(event.currentTarget);
        const index = links.indexOf(document.activeElement as HTMLElement);
        if (index === -1) return;
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        focusElement(links[(index + step + links.length) % links.length]);
      }}
      onPointerEnter={(event: PointerEvent<HTMLDivElement>) => {
        onPointerEnter?.(event);
        if (!event.defaultPrevented) root.cancelTimer();
      }}
      onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(event);
        if (!event.defaultPrevented && event.pointerType !== "touch") root.closeDelayed();
      }}
      {...rest}
    />
    </PanelContext.Provider>
  );
}

export interface NavigationMenuLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the current page (`aria-current="page"`). */
  active?: boolean;
  /** Short line under the label, for links inside a panel. */
  description?: string;
  /** Render the single child element (e.g. a router link) instead of an `<a>`, merging props and ref. */
  asChild?: boolean;
  /** Forwarded ref to the link. */
  ref?: Ref<HTMLAnchorElement>;
}

function NavigationMenuLink({
  active = false,
  description,
  asChild = false,
  className,
  children,
  onClick,
  ...rest
}: NavigationMenuLinkProps) {
  const root = useRoot("NavigationMenu.Link");
  // A link outside any Content sits on the bar itself and joins the arrow-key sequence.
  const inPanel = useContext(PanelContext);
  const Comp = (asChild ? Slot : "a") as "a";
  const content = description ? (
    <>
      <span className="mrd-navmenu__link-title">{children}</span>
      <span className="mrd-navmenu__link-description">{description}</span>
    </>
  ) : (
    children
  );
  return (
    <Comp
      aria-current={active ? "page" : undefined}
      data-active={active || undefined}
      data-mrd-navmenu-top={inPanel ? undefined : ""}
      className={cx("mrd-navmenu__link", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) root.setValue("");
      }}
      {...rest}
    >
      {asChild ? children : content}
    </Comp>
  );
}

/**
 * Site navigation (WAI-ARIA APG "Disclosure navigation menu"): a `<nav>` of links and disclosure
 * buttons that reveal link panels. Hover opens after a short delay; Enter, Space and ArrowDown open
 * from the keyboard; Escape closes and returns focus. Left/Right, Home and End move along the bar.
 */
export const NavigationMenu = {
  Root: withRef("NavigationMenu.Root", NavigationMenuRoot),
  List: withRef("NavigationMenu.List", NavigationMenuList),
  Item: withRef("NavigationMenu.Item", NavigationMenuItem),
  Trigger: withRef("NavigationMenu.Trigger", NavigationMenuTrigger),
  Content: withRef("NavigationMenu.Content", NavigationMenuContent),
  Link: withRef("NavigationMenu.Link", NavigationMenuLink),
};
