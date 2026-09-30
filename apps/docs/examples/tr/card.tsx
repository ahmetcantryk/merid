"use client";

import { Card, Heading, Section, Text } from "@merid/react";

function Body({ title }: { readonly title: string }) {
  return (
    <>
      <Heading level={3} size="lg">
        {title}
      </Heading>
      <Text size="sm">Kullanım her ayın birinde sıfırlanır.</Text>
    </>
  );
}

export function CardDemo() {
  return (
    <Card style={{ maxWidth: 320 }}>
      <Body title="Kullanım" />
    </Card>
  );
}

export function CardVariants() {
  return (
    <>
      <Card variant="tray" style={{ width: 220 }}>
        <Body title="Tray" />
      </Card>
      <Card variant="outline" style={{ width: 220 }}>
        <Body title="Outline" />
      </Card>
    </>
  );
}

export function CardElevated() {
  return (
    <Section tone="tray" spacing="compact" style={{ width: "100%", borderRadius: 14 }}>
      <Card variant="elevated" style={{ maxWidth: 320, marginInline: "auto" }}>
        <Body title="Elevated" />
      </Card>
    </Section>
  );
}

export function CardPaddings() {
  return (
    <>
      <Card padding="sm" style={{ width: 180 }}>
        <Text size="sm">sm · 20px</Text>
      </Card>
      <Card padding="md" style={{ width: 180 }}>
        <Text size="sm">md · 28px</Text>
      </Card>
      <Card padding="lg" style={{ width: 180 }}>
        <Text size="sm">lg · 32px</Text>
      </Card>
    </>
  );
}

export function CardInteractive() {
  return (
    <>
      <Card as="a" href="#" interactive style={{ width: 220, textDecoration: "none" }}>
        <Body title="Starter" />
      </Card>
      <Card as="a" href="#" interactive selected aria-current="true" style={{ width: 220, textDecoration: "none" }}>
        <Body title="Pro" />
      </Card>
    </>
  );
}
