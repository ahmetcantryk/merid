"use client";

import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  createContext,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import { useComposedRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { getRovingItems, ROVING_ITEM, useRovingFocus } from "../../internal/ovl-use-roving-focus";
import { Slot } from "../../internal/ovl-slot";
import { withRef } from "../../internal/ovl-with-ref";

type ToolbarOrientation = "horizontal" | "vertical";

const ToolbarContext = createContext<{ orientation: ToolbarOrientation } | null>(null);

function useToolbar(component: string) {
  const ctx = useContext(ToolbarContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Toolbar.Root>.`);
  return ctx;
}

export interface ToolbarRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout and arrow-key axis. Defaults to `"horizontal"`. */
  orientation?: ToolbarOrientation;
  /** Wrap from the last item to the first with the arrow keys. Defaults to true. */
  loop?: boolean;
  /** Accessible name; required unless you pass `aria-labelledby`. */
  "aria-label"?: string;
  /** Forwarded ref to the toolbar element. */
  ref?: Ref<HTMLDivElement>;
}

/** Keeps exactly one item in the Tab sequence (roving tabindex): the last focused, else the first. */
function syncTabStops(root: HTMLElement | null, active: HTMLElement | null) {
  if (!root) return;
  const all = Array.from(root.querySelectorAll<HTMLElement>(ROVING_ITEM));
  const enabled = getRovingItems(root);
  const current = active && enabled.includes(active) ? active : enabled[0];
  for (const item of all) item.tabIndex = item === current ? 0 : -1;
}

function ToolbarRoot({
  orientation = "horizontal",
  loop = true,
  className,
  onKeyDown,
  onFocus,
  ref,
  ...rest
}: ToolbarRootProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLElement | null>(null);
  const roving = useRovingFocus(rootRef, {
    orientation,
    loop,
    onMove: (item) => {
      activeRef.current = item;
      syncTabStops(rootRef.current, item);
    },
  });

  // Runs after every render so items added or disabled later still get the right tabindex.
  useLayoutEffect(() => {
    syncTabStops(rootRef.current, activeRef.current);
  });

  const mergedRef = useComposedRefs(rootRef, ref);
  return (
    <ToolbarContext.Provider value={{ orientation }}>
      <div
        ref={mergedRef}
        role="toolbar"
        aria-orientation={orientation}
        data-orientation={orientation}
        className={cx("mrd-toolbar", className)}
        onFocus={(event: FocusEvent<HTMLDivElement>) => {
          onFocus?.(event);
          const target = event.target as HTMLElement;
          if (target.matches(ROVING_ITEM)) {
            activeRef.current = target;
            syncTabStops(rootRef.current, target);
          }
        }}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if ((event.target as HTMLElement).matches(ROVING_ITEM)) roving(event);
        }}
        {...rest}
      />
    </ToolbarContext.Provider>
  );
}

export interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the single child element (e.g. an `IconButton` or a `DropdownMenu.Trigger`) instead of a `<button>`. */
  asChild?: boolean;
  /** Disable the button. It stays in the DOM but is skipped by arrow keys. */
  disabled?: boolean;
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

function ToolbarButton({ asChild = false, disabled = false, type = "button", className, onClick, ...rest }: ToolbarButtonProps) {
  useToolbar("Toolbar.Button");
  const Comp = (asChild ? Slot : "button") as "button";
  return (
    <Comp
      type={asChild ? undefined : type}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "" : undefined}
      data-mrd-roving=""
      className={cx(asChild ? undefined : "mrd-toolbar__button", className)}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
    />
  );
}

export interface ToolbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Render the single child element (e.g. a router link) instead of an `<a>`. */
  asChild?: boolean;
  /** Forwarded ref to the link. */
  ref?: Ref<HTMLAnchorElement>;
}

function ToolbarLink({ asChild = false, className, ...rest }: ToolbarLinkProps) {
  useToolbar("Toolbar.Link");
  const Comp = (asChild ? Slot : "a") as "a";
  return <Comp data-mrd-roving="" className={cx(asChild ? undefined : "mrd-toolbar__link", className)} {...rest} />;
}

export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible group name, e.g. `"Text formatting"`. */
  "aria-label"?: string;
  /** Forwarded ref to the group element. */
  ref?: Ref<HTMLDivElement>;
}

function ToolbarGroup({ className, ...rest }: ToolbarGroupProps) {
  useToolbar("Toolbar.Group");
  return <div role="group" className={cx("mrd-toolbar__group", className)} {...rest} />;
}

export interface ToolbarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Forwarded ref to the separator element. */
  ref?: Ref<HTMLDivElement>;
}

function ToolbarSeparator({ className, ...rest }: ToolbarSeparatorProps) {
  const ctx = useToolbar("Toolbar.Separator");
  return (
    <div
      role="separator"
      aria-orientation={ctx.orientation === "horizontal" ? "vertical" : "horizontal"}
      className={cx("mrd-toolbar__separator", className)}
      {...rest}
    />
  );
}

/**
 * Toolbar (WAI-ARIA APG "Toolbar"): one Tab stop for the whole bar; arrow keys, Home and End move
 * between its controls. Right/Left follow reading direction in RTL.
 */
export const Toolbar = {
  Root: withRef("Toolbar.Root", ToolbarRoot),
  Button: withRef("Toolbar.Button", ToolbarButton),
  Link: withRef("Toolbar.Link", ToolbarLink),
  Group: withRef("Toolbar.Group", ToolbarGroup),
  Separator: withRef("Toolbar.Separator", ToolbarSeparator),
};
