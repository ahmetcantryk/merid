"use client";

import { Separator, Stack, Text } from "@meridui/react";

export function SeparatorDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Text weight="medium" tone="ink">
        Hesap
      </Text>
      <Separator style={{ marginBlock: 12 }} />
      <Text size="sm">Profil, e-posta ve şifre.</Text>
    </div>
  );
}

export function SeparatorVertical() {
  return (
    <Stack direction="row" gap={3} align="center" style={{ height: 20 }}>
      <Text size="sm" as="span">Dokümanlar</Text>
      <Separator orientation="vertical" />
      <Text size="sm" as="span">Sürüm notları</Text>
      <Separator orientation="vertical" />
      <Text size="sm" as="span">GitHub</Text>
    </Stack>
  );
}

export function SeparatorSemantic() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Text size="sm">Son dosyalar</Text>
      <Separator decorative={false} style={{ marginBlock: 12 }} />
      <Text size="sm">Seninle paylaşılanlar</Text>
    </div>
  );
}
