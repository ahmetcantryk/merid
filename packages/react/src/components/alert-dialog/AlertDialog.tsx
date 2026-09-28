"use client";

import type { ButtonHTMLAttributes, Ref } from "react";
import {
  CloseButton,
  Dialog,
  type DialogContentProps,
  type DialogRootProps,
  ModalSurface,
} from "../dialog/Dialog";
import { withRef } from "../../internal/ovl-with-ref";

export interface AlertDialogRootProps extends DialogRootProps {}

export interface AlertDialogContentProps extends Omit<DialogContentProps, "closeOnOutsidePress" | "size"> {}

function AlertDialogContent(props: AlertDialogContentProps) {
  return (
    <ModalSurface
      role="alertdialog"
      component="AlertDialog.Content"
      baseClass="mrd-dialog"
      backdropClass="mrd-dialog__backdrop"
      dataAttributes={{ "data-kind": "alert" }}
      closeOnOutsidePress={false}
      {...props}
    />
  );
}

export type AlertDialogActionTone = "primary" | "danger";

export interface AlertDialogActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style of the confirming action. Defaults to `"primary"`; use `"danger"` for destructive actions. */
  tone?: AlertDialogActionTone;
  /** Render the single child element instead of a `<button>`, merging props, ref and handlers. */
  asChild?: boolean;
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Confirms and closes; styled as a primary (or `tone="danger"`) Button.
 * Call `event.preventDefault()` in `onClick` to keep the dialog open (e.g. while saving).
 */
function AlertDialogAction({ tone = "primary", ...props }: AlertDialogActionProps) {
  return <CloseButton component="AlertDialog.Action" icon={false} variant={tone} {...props} />;
}

export interface AlertDialogCancelProps extends Omit<AlertDialogActionProps, "tone"> {}

/** Dismisses; styled as a secondary Button. Receives initial focus, as recommended for destructive confirmations. */
function AlertDialogCancel(props: AlertDialogCancelProps) {
  return <CloseButton component="AlertDialog.Cancel" icon={false} variant="secondary" data-autofocus="" {...props} />;
}

/**
 * Alert dialog (WAI-ARIA APG "Alert and Message Dialogs"): modal, `role="alertdialog"`,
 * does not close on outside press, focuses Cancel first.
 */
export const AlertDialog = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Content: withRef("AlertDialog.Content", AlertDialogContent),
  Title: Dialog.Title,
  Description: Dialog.Description,
  Footer: Dialog.Footer,
  Action: withRef("AlertDialog.Action", AlertDialogAction),
  Cancel: withRef("AlertDialog.Cancel", AlertDialogCancel),
};
