"use client";

import { IconButton } from "@meridui/react";
import { CloseIcon, PlusIcon, SettingsIcon, TrashIcon } from "./icons";

export function IconButtonDemo() {
  return <IconButton label="Settings" icon={<SettingsIcon />} />;
}

export function IconButtonVariants() {
  return (
    <>
      <IconButton variant="ghost" label="Settings" icon={<SettingsIcon />} />
      <IconButton variant="secondary" label="Delete" icon={<TrashIcon />} />
      <IconButton variant="primary" label="Add item" icon={<PlusIcon />} />
    </>
  );
}

export function IconButtonSizes() {
  return (
    <>
      <IconButton size="sm" label="Close" icon={<CloseIcon />} />
      <IconButton size="md" label="Close" icon={<CloseIcon />} />
      <IconButton size="lg" label="Close" icon={<CloseIcon />} />
    </>
  );
}

export function IconButtonDisabled() {
  return <IconButton variant="secondary" label="Delete" icon={<TrashIcon />} disabled />;
}
