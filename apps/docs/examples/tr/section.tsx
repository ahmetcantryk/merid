"use client";

import { Card, Container, Heading, Section, Text } from "@merid/react";

const frame = { width: "100%", border: "1px dashed var(--mrd-line-strong)", borderRadius: 12, overflow: "hidden" } as const;

export function SectionDemo() {
  return (
    <div style={frame}>
      <Section tone="tray" spacing="compact">
        <Container>
          <Heading level={2} size="h3">
            Fiyatlandırma
          </Heading>
          <Text tone="muted">Tek paket, aylık faturalandırılır.</Text>
        </Container>
      </Section>
    </div>
  );
}

export function SectionTones() {
  return (
    <div style={frame}>
      <Section spacing="compact">
        <Container>
          <Text>default tonu: sayfa arka planı.</Text>
        </Container>
      </Section>
      <Section tone="tray" spacing="compact">
        <Container>
          <Text>tray tonu: geride duran alternatif bant.</Text>
        </Container>
      </Section>
    </div>
  );
}

export function SectionSpacing() {
  return (
    <div style={frame}>
      <Section tone="tray" spacing="compact">
        <Container>
          <Text>compact: --mrd-section değerinin yarısı</Text>
        </Container>
      </Section>
      <Section spacing="none">
        <Container>
          <Text>none: dikey boşluk yok</Text>
        </Container>
      </Section>
    </div>
  );
}

export function SectionCards() {
  return (
    <div style={frame}>
      <Section tone="tray" spacing="compact">
        <Container>
          <Card variant="elevated">
            <Text>Elevated bir kart, tray section üzerinde yükseltilmiş bir yüzey gibi görünür.</Text>
          </Card>
        </Container>
      </Section>
    </div>
  );
}
