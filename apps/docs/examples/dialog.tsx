"use client";

import { useState } from "react";
import { Button, Dialog, Field, Input, Select, Stack, type DialogSize } from "@merid/react";

export function DialogDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">Edit profile</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>Changes are visible to everyone in your workspace.</Dialog.Description>
        <Stack gap={4} style={{ marginTop: 20 }}>
          <Field label="Display name">
            <Input defaultValue="Ada Lovelace" />
          </Field>
          <Field label="Role">
            <Select.Root defaultValue="editor">
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="viewer">Viewer</Select.Item>
                <Select.Item value="editor">Editor</Select.Item>
                <Select.Item value="admin">Admin</Select.Item>
              </Select.Content>
            </Select.Root>
          </Field>
        </Stack>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Dialog.Close asChild>
            <Button variant="primary">Save</Button>
          </Dialog.Close>
        </Dialog.Footer>
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
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

const DIALOG_SIZES: readonly DialogSize[] = ["sm", "md", "lg", "full"];

export function DialogSizesDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {DIALOG_SIZES.map((size) => (
        <Dialog.Root key={size}>
          <Dialog.Trigger asChild>
            <Button variant="secondary">{size}</Button>
          </Dialog.Trigger>
          <Dialog.Content size={size}>
            <Dialog.Title>Size {size}</Dialog.Title>
            <Dialog.Description>The size prop sets the maximum width of the surface.</Dialog.Description>
            <Dialog.Footer>
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </div>
  );
}
