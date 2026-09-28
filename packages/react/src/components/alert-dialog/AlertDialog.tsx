import type { ButtonHTMLAttributes, Ref } from "react";
import {
  CloseButton,
  Dialog,
  type DialogContentProps,
  type DialogRootProps,
  ModalSurface,
} from "../dialog/Dialog";

export interface AlertDialogRootProps extends DialogRootProps {}

export interface AlertDialogContentProps extends Omit<DialogContentProps, "closeOnOutsidePress"> {}

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

export interface AlertDialogActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

/** Confirms and closes. Call `event.preventDefault()` in `onClick` to keep the dialog open (e.g. while saving). */
function AlertDialogAction(props: AlertDialogActionProps) {
  return <CloseButton component="AlertDialog.Action" icon={false} {...props} />;
}

export interface AlertDialogCancelProps extends AlertDialogActionProps {}

/** Dismisses. Receives initial focus, as recommended for destructive confirmations. */
function AlertDialogCancel(props: AlertDialogCancelProps) {
  return <CloseButton component="AlertDialog.Cancel" icon={false} data-autofocus="" {...props} />;
}

/**
 * Alert dialog (WAI-ARIA APG "Alert and Message Dialogs"): modal, `role="alertdialog"`,
 * does not close on outside press, focuses Cancel first.
 */
export const AlertDialog = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Content: AlertDialogContent,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Footer: Dialog.Footer,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
};
