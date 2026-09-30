"use client";

import { Text } from "@meridui/react";

export function TextDemo() {
  return (
    <Text prose>
      Merid separates regions by surface before border, keeps one accent for interaction, and lets tone and weight
      carry hierarchy.
    </Text>
  );
}

export function TextSizes() {
  return (
    <div style={{ width: "100%" }}>
      <Text size="lg">lg: lead paragraph, 18px</Text>
      <Text size="md">md: body, 16px</Text>
      <Text size="sm">sm: secondary text</Text>
      <Text size="xs">xs: dense UI text</Text>
      <Text size="2xs">2xs: meta</Text>
      <Text size="3xs">3xs: caption, 12px</Text>
    </div>
  );
}

export function TextTones() {
  return (
    <div style={{ width: "100%" }}>
      <Text tone="ink">ink: headings and strong text</Text>
      <Text tone="body">body: default running text</Text>
      <Text tone="muted">muted: meta only</Text>
      <Text tone="accent">accent: interactive emphasis</Text>
      <Text tone="danger">danger: error copy</Text>
    </div>
  );
}

export function TextWeights() {
  return (
    <div style={{ width: "100%" }}>
      <Text weight="regular">Regular</Text>
      <Text weight="medium">Medium</Text>
      <Text weight="semibold">Semibold</Text>
    </div>
  );
}

export function TextNumeric() {
  return (
    <div>
      <Text numeric>1,204.50</Text>
      <Text numeric>987.10</Text>
      <Text as="span" size="sm" tone="muted">
        Rendered as a span
      </Text>
    </div>
  );
}
