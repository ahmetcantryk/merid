"use client";

import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type Ref,
  useContext,
  useMemo,
} from "react";
import { cx } from "../../internal/ovl-cx";
import { Slot } from "../../internal/ovl-slot";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useId } from "../../internal/ovl-use-id";
import { withRef } from "../../internal/ovl-with-ref";

interface CollapsibleContextValue {
  open: boolean;
  disabled: boolean;
  toggle: () => void;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible(component: string) {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Collapsible.Root>.`);
  return ctx;
}

export interface CollapsibleRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Prevent toggling. */
  disabled?: boolean;
  /** Forwarded ref to the root element. */
  ref?: Ref<HTMLDivElement>;
}

function CollapsibleRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  ...rest
}: CollapsibleRootProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const contentId = useId(undefined, "mrd-collapsible");
  const value = useMemo<CollapsibleContextValue>(
    () => ({ open, disabled, toggle: () => setOpen((prev) => !prev), contentId }),
    [open, disabled, setOpen, contentId],
  );
  return (
    <CollapsibleContext.Provider value={value}>
      <div
        className={cx("mrd-collapsible", className)}
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        {...rest}
      />
    </CollapsibleContext.Provider>
  );
}

export interface CollapsibleTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the single child element (e.g. your own `Button`) instead of a `<button>`, merging props, ref and handlers. */
  asChild?: boolean;
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

function CollapsibleTrigger({ asChild = false, onClick, type = "button", className, ...rest }: CollapsibleTriggerProps) {
  const ctx = useCollapsible("Collapsible.Trigger");
  const Comp = (asChild ? Slot : "button") as "button";
  return (
    <Comp
      type={asChild ? undefined : type}
      aria-expanded={ctx.open}
      aria-controls={ctx.contentId}
      disabled={ctx.disabled || undefined}
      data-state={ctx.open ? "open" : "closed"}
      data-disabled={ctx.disabled ? "" : undefined}
      className={cx(asChild ? undefined : "mrd-collapsible__trigger", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !ctx.disabled) ctx.toggle();
      }}
      {...rest}
    />
  );
}

export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Keep the children mounted (hidden) while closed, e.g. for in-page search or form state. Defaults to false. */
  forceMount?: boolean;
  /** Forwarded ref to the content element. */
  ref?: Ref<HTMLDivElement>;
}

function CollapsibleContent({ forceMount = false, className, children, ...rest }: CollapsibleContentProps) {
  const ctx = useCollapsible("Collapsible.Content");
  return (
    <div
      id={ctx.contentId}
      hidden={!ctx.open}
      data-state={ctx.open ? "open" : "closed"}
      className={cx("mrd-collapsible__content", className)}
      {...rest}
    >
      {ctx.open || forceMount ? children : null}
    </div>
  );
}

/**
 * Collapsible (WAI-ARIA APG "Disclosure"): a button that shows and hides one region.
 * Use Accordion for a set of headed sections.
 */
export const Collapsible = {
  Root: withRef("Collapsible.Root", CollapsibleRoot),
  Trigger: withRef("Collapsible.Trigger", CollapsibleTrigger),
  Content: withRef("Collapsible.Content", CollapsibleContent),
};
