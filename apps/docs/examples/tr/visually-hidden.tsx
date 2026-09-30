"use client";

import { IconButton, Text, VisuallyHidden } from "@merid/react";
import { SettingsIcon } from "../icons";

export function VisuallyHiddenDemo() {
  return (
    <Text>
      Gelir %12 arttı
      <VisuallyHidden> (geçen aya göre)</VisuallyHidden>
    </Text>
  );
}

export function VisuallyHiddenHeading() {
  return (
    <nav aria-labelledby="vh-nav">
      <VisuallyHidden as="h2" id="vh-nav">
        Hesap ayarları
      </VisuallyHidden>
      <IconButton label="Ayarlar" icon={<SettingsIcon />} />
    </nav>
  );
}
