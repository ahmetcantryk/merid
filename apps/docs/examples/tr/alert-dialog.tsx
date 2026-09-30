"use client";

import { AlertDialog, Button } from "@meridui/react";

export function AlertDialogDemo() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="danger">Projeyi sil</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>“Northwind” silinsin mi?</AlertDialog.Title>
        <AlertDialog.Description>
          Proje ve içindeki 24 dosya kalıcı olarak silinir. Bu işlem geri alınamaz.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Vazgeç</AlertDialog.Cancel>
          <AlertDialog.Action tone="danger">Projeyi sil</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
