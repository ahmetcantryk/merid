"use client";

import { useState } from "react";
import { Button, Dialog, Field, Input } from "@merid/react";

export function DialogDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="mrd-button" data-variant="secondary" data-size="md">
        Edit profile
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>Changes are visible to everyone in your workspace.</Dialog.Description>
        <div style={{ marginTop: 20 }}>
          <Field label="Display name">
            <Input defaultValue="Ada Lovelace" />
          </Field>
        </div>
        <Dialog.Footer>
          <Dialog.Close className="mrd-button" data-variant="secondary" data-size="md">
            Cancel
          </Dialog.Close>
          <Dialog.Close className="mrd-button" data-variant="primary" data-size="md">
            Save
          </Dialog.Close>
        </Dialog.Footer>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function DialogControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open from state
      </Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content>
          <Dialog.Title>Controlled dialog</Dialog.Title>
          <Dialog.Description>Open state lives in the parent component.</Dialog.Description>
          <Dialog.Footer>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Done
            </Button>
          </Dialog.Footer>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
