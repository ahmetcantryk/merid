"use client";

import { useState } from "react";
import { Button, Dialog, Field, Input, Select, Stack, type DialogSize } from "@merid/react";

export function DialogDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">Profili düzenle</Button>
      </Dialog.Trigger>
      <Dialog.Content closeLabel="Kapat">
        <Dialog.Title>Profili düzenle</Dialog.Title>
        <Dialog.Description>Değişiklikleri çalışma alanındaki herkes görür.</Dialog.Description>
        <Stack gap={4} style={{ marginTop: 20 }}>
          <Field label="Görünen ad">
            <Input defaultValue="Ada Lovelace" />
          </Field>
          <Field label="Rol">
            <Select.Root defaultValue="editor">
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="viewer">İzleyici</Select.Item>
                <Select.Item value="editor">Editör</Select.Item>
                <Select.Item value="admin">Yönetici</Select.Item>
              </Select.Content>
            </Select.Root>
          </Field>
        </Stack>
        <Dialog.Footer>
          <Dialog.Close>Vazgeç</Dialog.Close>
          <Dialog.Close asChild>
            <Button variant="primary">Kaydet</Button>
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
        State'ten aç
      </Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content closeLabel="Kapat">
          <Dialog.Title>Controlled dialog</Dialog.Title>
          <Dialog.Description>Açık/kapalı state'i üst component'te tutuluyor.</Dialog.Description>
          <Dialog.Footer>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Tamam
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
          <Dialog.Content size={size} closeLabel="Kapat">
            <Dialog.Title>Boyut: {size}</Dialog.Title>
            <Dialog.Description>size prop'u yüzeyin maksimum genişliğini belirler.</Dialog.Description>
            <Dialog.Footer>
              <Dialog.Close>Kapat</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </div>
  );
}
