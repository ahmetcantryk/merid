"use client";

import { Dialog, type DialogContentProps, type DialogRootProps, ModalSurface } from "../dialog/Dialog";
import { withRef } from "../../internal/ovl-with-ref";

export interface DrawerRootProps extends DialogRootProps {}

export type DrawerSide = "left" | "right";

export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerContentProps extends Omit<DialogContentProps, "size"> {
  /** Edge the sheet slides in from. Defaults to `"right"`. */
  side?: DrawerSide;
  /** Sheet width: `sm` 320px, `md` 420px (default), `lg` 560px; always capped to the viewport minus 48px. */
  size?: DrawerSize;
}

function DrawerContent({ side = "right", size = "md", ...props }: DrawerContentProps) {
  return (
    <ModalSurface
      role="dialog"
      component="Drawer.Content"
      baseClass="mrd-drawer"
      backdropClass="mrd-drawer__backdrop"
      dataAttributes={{ "data-side": side, "data-size": size }}
      {...props}
    />
  );
}

/** Side sheet. Same behaviour and parts as Dialog; `Drawer.Content` takes `side` and `size`. */
export const Drawer = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Content: withRef("Drawer.Content", DrawerContent),
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
  Footer: Dialog.Footer,
};
