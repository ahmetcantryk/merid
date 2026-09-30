"use client";

import { Separator, Stack, Text } from "@meridui/react";

export function SeparatorDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Text weight="medium" tone="ink">
        Account
      </Text>
      <Separator style={{ marginBlock: 12 }} />
      <Text size="sm">Profile, email and password.</Text>
    </div>
  );
}

export function SeparatorVertical() {
  return (
    <Stack direction="row" gap={3} align="center" style={{ height: 20 }}>
      <Text size="sm" as="span">Docs</Text>
      <Separator orientation="vertical" />
      <Text size="sm" as="span">Changelog</Text>
      <Separator orientation="vertical" />
      <Text size="sm" as="span">GitHub</Text>
    </Stack>
  );
}

export function SeparatorSemantic() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Text size="sm">Recent files</Text>
      <Separator decorative={false} style={{ marginBlock: 12 }} />
      <Text size="sm">Shared with you</Text>
    </div>
  );
}
