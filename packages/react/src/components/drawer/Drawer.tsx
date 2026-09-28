import { Dialog, type DialogContentProps, type DialogRootProps, ModalSurface } from "../dialog/Dialog";

export interface DrawerRootProps extends DialogRootProps {}

export type DrawerSide = "left" | "right";

export interface DrawerContentProps extends DialogContentProps {
  /** Edge the sheet slides in from. Defaults to `"right"`. */
  side?: DrawerSide;
}

function DrawerContent({ side = "right", ...props }: DrawerContentProps) {
  return (
    <ModalSurface
      role="dialog"
      component="Drawer.Content"
      baseClass="mrd-drawer"
      backdropClass="mrd-drawer__backdrop"
      dataAttributes={{ "data-side": side }}
      {...props}
    />
  );
}

/** Side sheet. Same behaviour and parts as Dialog; `Drawer.Content` takes `side`. */
export const Drawer = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Content: DrawerContent,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
  Footer: Dialog.Footer,
};
