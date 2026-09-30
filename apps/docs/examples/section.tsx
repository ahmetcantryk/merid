"use client";

import { Card, Container, Heading, Section, Text } from "@meridui/react";

const frame = { width: "100%", border: "1px dashed var(--mrd-line-strong)", borderRadius: 12, overflow: "hidden" } as const;

export function SectionDemo() {
  return (
    <div style={frame}>
      <Section tone="tray" spacing="compact">
        <Container>
          <Heading level={2} size="h3">
            Pricing
          </Heading>
          <Text tone="muted">One plan, billed monthly.</Text>
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
          <Text>Default tone: the page background.</Text>
        </Container>
      </Section>
      <Section tone="tray" spacing="compact">
        <Container>
          <Text>Tray tone: the recessed alternate band.</Text>
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
          <Text>compact: half of --mrd-section</Text>
        </Container>
      </Section>
      <Section spacing="none">
        <Container>
          <Text>none: no vertical padding</Text>
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
            <Text>An elevated card reads as a lifted surface on a tray section.</Text>
          </Card>
        </Container>
      </Section>
    </div>
  );
}
