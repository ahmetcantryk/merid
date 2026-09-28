"use client";

import { AlertDialog } from "@merid/react";

export function AlertDialogDemo() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="mrd-button" data-variant="danger" data-size="md">
        Delete project
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete “Northwind”?</AlertDialog.Title>
        <AlertDialog.Description>
          The project and its 24 files are removed permanently. This cannot be undone.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel className="mrd-button" data-variant="secondary" data-size="md">
            Cancel
          </AlertDialog.Cancel>
          <AlertDialog.Action className="mrd-button" data-variant="danger" data-size="md">
            Delete project
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
