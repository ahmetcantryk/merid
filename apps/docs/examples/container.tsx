"use client";

import { Container } from "@meridui/react";
import { Box } from "./layout-box";

const frame = { width: "100%", background: "var(--mrd-tray)", paddingBlock: 16, borderRadius: 8 } as const;

export function ContainerDemo() {
  return (
    <div style={frame}>
      <Container>
        <Box>Content capped at 1160px, centred, with a side gutter</Box>
      </Container>
    </div>
  );
}

export function ContainerProse() {
  return (
    <div style={frame}>
      <Container size="prose">
        <Box>Reading width: 720px</Box>
      </Container>
    </div>
  );
}
