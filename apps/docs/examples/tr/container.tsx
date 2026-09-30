"use client";

import { Container } from "@merid/react";
import { Box } from "../layout-box";

const frame = { width: "100%", background: "var(--mrd-tray)", paddingBlock: 16, borderRadius: 8 } as const;

export function ContainerDemo() {
  return (
    <div style={frame}>
      <Container>
        <Box>İçerik 1160px ile sınırlı, ortalı ve yan boşluklu</Box>
      </Container>
    </div>
  );
}

export function ContainerProse() {
  return (
    <div style={frame}>
      <Container size="prose">
        <Box>Okuma genişliği: 720px</Box>
      </Container>
    </div>
  );
}
