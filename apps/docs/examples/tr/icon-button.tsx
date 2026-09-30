"use client";

import { IconButton } from "@meridui/react";
import { CloseIcon, PlusIcon, SettingsIcon, TrashIcon } from "../icons";

export function IconButtonDemo() {
  return <IconButton label="Ayarlar" icon={<SettingsIcon />} />;
}

export function IconButtonVariants() {
  return (
    <>
      <IconButton variant="ghost" label="Ayarlar" icon={<SettingsIcon />} />
      <IconButton variant="secondary" label="Sil" icon={<TrashIcon />} />
      <IconButton variant="primary" label="Öğe ekle" icon={<PlusIcon />} />
    </>
  );
}

export function IconButtonSizes() {
  return (
    <>
      <IconButton size="sm" label="Kapat" icon={<CloseIcon />} />
      <IconButton size="md" label="Kapat" icon={<CloseIcon />} />
      <IconButton size="lg" label="Kapat" icon={<CloseIcon />} />
    </>
  );
}

export function IconButtonDisabled() {
  return <IconButton variant="secondary" label="Sil" icon={<TrashIcon />} disabled />;
}
