"use client";

import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useComposedRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { Portal } from "../../internal/ovl-portal";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useDismiss } from "../../internal/ovl-use-dismiss";
import { useFocusTrap } from "../../internal/ovl-use-focus-trap";
import { useId } from "../../internal/ovl-use-id";
import { useScrollLock } from "../../internal/ovl-use-scroll-lock";
import { Slot } from "../../internal/ovl-slot";
import { withRef } from "../../internal/ovl-with-ref";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

/** @internal Shared by Dialog, AlertDialog and Drawer. */
export function useDialogContext(component: string): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error(`<${component}> must be used inside its Root.`);
  return ctx;
}

export interface DialogRootProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Trigger, Content and anything else sharing this dialog's state. */
  children?: ReactNode;
}

function DialogRoot({ open: openProp, defaultOpen = false, onOpenChange, children }: DialogRootProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const [hasDescription, setHasDescription] = useState(false);
  const contentId = useId(undefined, "mrd-dialog");
  const value = useMemo<DialogContextValue>(
    () => ({
      open,
      setOpen,
      contentId,
      titleId: `${contentId}-title`,
      descriptionId: `${contentId}-desc`,
      hasDescription,
      setHasDescription,
    }),
    [open, setOpen, contentId, hasDescription],
  );
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export interface DialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the single child element (e.g. your own `Button`) instead of a `<button>`, merging props, ref and handlers. */
  asChild?: boolean;
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

function DialogTrigger({ asChild = false, onClick, type = "button", className, ...rest }: DialogTriggerProps) {
  const ctx = useDialogContext("Dialog.Trigger");
  const Comp = (asChild ? Slot : "button") as "button";
  return (
    <Comp
      type={asChild ? undefined : type}
      aria-haspopup="dialog"
      aria-expanded={ctx.open}
      aria-controls={ctx.open ? ctx.contentId : undefined}
      data-state={ctx.open ? "open" : "closed"}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.setOpen(!ctx.open);
      }}
      {...rest}
    />
  );
}

export interface ModalSurfaceProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  /** Close when the backdrop is pressed. Defaults to true. */
  closeOnOutsidePress?: boolean;
  /** Close on Escape. Defaults to true. */
  closeOnEscape?: boolean;
  /** Element to focus when opened; defaults to `[data-autofocus]`, then the first tabbable element. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Portal target; defaults to `document.body`. */
  container?: Element | null;
  /** Forwarded ref to the dialog element. */
  ref?: Ref<HTMLDivElement>;
}

interface ModalSurfaceInternalProps extends ModalSurfaceProps {
  role: "dialog" | "alertdialog";
  component: string;
  baseClass: string;
  backdropClass: string;
  dataAttributes?: Record<string, string>;
}

/** @internal Modal surface: portal, backdrop, focus trap, scroll lock and dismiss. */
function ModalSurfaceImpl({
  role,
  component,
  baseClass,
  backdropClass,
  dataAttributes,
  closeOnOutsidePress = true,
  closeOnEscape = true,
  initialFocus,
  container,
  className,
  children,
  ref,
  ...rest
}: ModalSurfaceInternalProps) {
  const ctx = useDialogContext(component);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const active = ctx.open && node !== null;

  useFocusTrap(contentRef, active, { initialFocus });
  useScrollLock(ctx.open);
  useDismiss([contentRef], active, () => ctx.setOpen(false), {
    escape: closeOnEscape,
    outsidePress: closeOnOutsidePress,
  });

  const mergedRef = useComposedRefs(contentRef, setNode, ref);

  if (!ctx.open) return null;
  return (
    <Portal container={container}>
      <div className={backdropClass} data-state="open" {...dataAttributes}>
        <div
          ref={mergedRef}
          id={ctx.contentId}
          role={role}
          aria-modal="true"
          aria-labelledby={ctx.titleId}
          aria-describedby={ctx.hasDescription ? ctx.descriptionId : undefined}
          tabIndex={-1}
          data-state="open"
          {...dataAttributes}
          className={cx(baseClass, className)}
          {...rest}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

export type DialogSize = "sm" | "md" | "lg" | "full";

export interface DialogContentProps extends ModalSurfaceProps {
  /** Max width: `sm` 440px, `md` 560px (default), `lg` 720px, `full` the viewport minus a 16px margin. */
  size?: DialogSize;
}

function DialogContent({ size = "md", ...props }: DialogContentProps) {
  return (
    <ModalSurface
      role="dialog"
      component="Dialog.Content"
      baseClass="mrd-dialog"
      backdropClass="mrd-dialog__backdrop"
      dataAttributes={{ "data-size": size }}
      {...props}
    />
  );
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Forwarded ref to the heading. */
  ref?: Ref<HTMLHeadingElement>;
}

function DialogTitle({ className, ...rest }: DialogTitleProps) {
  const ctx = useDialogContext("Dialog.Title");
  return <h2 id={ctx.titleId} className={cx("mrd-dialog__title", className)} {...rest} />;
}

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Forwarded ref to the paragraph. */
  ref?: Ref<HTMLParagraphElement>;
}

function DialogDescription({ className, ...rest }: DialogDescriptionProps) {
  const ctx = useDialogContext("Dialog.Description");
  const { setHasDescription } = ctx;
  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);
  return <p id={ctx.descriptionId} className={cx("mrd-dialog__description", className)} {...rest} />;
}

export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Render the standard top-right icon button. Defaults to true without children; with children
   * it renders as a secondary Button. Use `asChild` to supply your own element instead.
   */
  icon?: boolean;
  /** Render the single child element instead of a `<button>`, merging props, ref and handlers. */
  asChild?: boolean;
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** @internal Close button shared by Dialog-like components. */
function CloseButtonImpl({
  icon,
  asChild = false,
  onClick,
  className,
  children,
  type = "button",
  component,
  variant = "secondary",
  ...rest
}: DialogCloseProps & { component: string; variant?: "primary" | "secondary" | "danger" }) {
  const ctx = useDialogContext(component);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) ctx.setOpen(false);
  };
  if (asChild) {
    const SlotButton = Slot as unknown as "button";
    return (
      <SlotButton className={className} onClick={handleClick} {...rest}>
        {children}
      </SlotButton>
    );
  }
  const showIcon = icon ?? children === undefined;
  return (
    <button
      type={type}
      aria-label={showIcon && !rest["aria-label"] ? "Close" : rest["aria-label"]}
      className={cx(showIcon ? "mrd-dialog__close" : "mrd-button", className)}
      data-variant={showIcon ? undefined : variant}
      data-size={showIcon ? undefined : "md"}
      onClick={handleClick}
      {...rest}
    >
      {showIcon ? <CloseIcon /> : <span className="mrd-button__content">{children}</span>}
    </button>
  );
}

function DialogClose(props: DialogCloseProps) {
  return <CloseButton component="Dialog.Close" {...props} />;
}

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

function DialogFooter({ className, ...rest }: DialogFooterProps) {
  return <div className={cx("mrd-dialog__footer", className)} {...rest} />;
}

/**
 * Modal dialog (WAI-ARIA APG "Dialog (Modal)").
 * Focus is trapped while open and returned to the previously focused element on close.
 * Becomes a bottom sheet at ≤ 640px.
 */
export const ModalSurface = withRef("ModalSurface", ModalSurfaceImpl);
export const CloseButton = withRef("CloseButton", CloseButtonImpl);

export const Dialog = {
  Root: DialogRoot,
  Trigger: withRef("Dialog.Trigger", DialogTrigger),
  Content: withRef("Dialog.Content", DialogContent),
  Title: withRef("Dialog.Title", DialogTitle),
  Description: withRef("Dialog.Description", DialogDescription),
  Close: withRef("Dialog.Close", DialogClose),
  Footer: withRef("Dialog.Footer", DialogFooter),
};
