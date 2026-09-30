"use client";

import { useState } from "react";
import { Button } from "@merid/react";
import { ArrowRightIcon, PlusIcon, TrashIcon } from "../icons";

export function ButtonDemo() {
  return (
    <>
      <Button variant="primary">Değişiklikleri kaydet</Button>
      <Button>Vazgeç</Button>
    </>
  );
}

export function ButtonVariants() {
  return (
    <>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="link">Link</Button>
    </>
  );
}

export function ButtonSizes() {
  return (
    <>
      <Button size="sm">Küçük</Button>
      <Button size="md">Orta</Button>
      <Button size="lg">Büyük</Button>
    </>
  );
}

export function ButtonIcons() {
  return (
    <>
      <Button variant="primary" leadingIcon={<PlusIcon />}>
        Yeni proje
      </Button>
      <Button trailingIcon={<ArrowRightIcon />}>Devam et</Button>
      <Button variant="danger" leadingIcon={<TrashIcon />}>
        Sil
      </Button>
    </>
  );
}

export function ButtonLoading() {
  const [saving, setSaving] = useState(false);
  return (
    <Button
      variant="primary"
      loading={saving}
      onClick={() => {
        setSaving(true);
        window.setTimeout(() => setSaving(false), 1500);
      }}
    >
      Değişiklikleri kaydet
    </Button>
  );
}

export function ButtonDisabled() {
  return (
    <>
      <Button variant="primary" disabled>
        Yayınla
      </Button>
      <Button disabled>Dışa aktar</Button>
    </>
  );
}

export function ButtonFullWidth() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Button variant="primary" fullWidth>
        Hesap oluştur
      </Button>
    </div>
  );
}
