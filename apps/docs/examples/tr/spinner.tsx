"use client";

import { Spinner, Stack, Text } from "@merid/react";

export function SpinnerDemo() {
  return <Spinner label="Yükleniyor" />;
}

export function SpinnerSizes() {
  return (
    <>
      <Spinner size="sm" label="Yükleniyor" />
      <Spinner size="md" label="Yükleniyor" />
      <Spinner size="lg" label="Yükleniyor" />
    </>
  );
}

export function SpinnerWithText() {
  return (
    <Stack direction="row" gap={2} align="center">
      <Spinner size="sm" label={null} />
      <Text size="sm" as="span">
        Faturalar yükleniyor…
      </Text>
    </Stack>
  );
}

export function SpinnerColor() {
  return (
    <span style={{ color: "var(--mrd-accent)" }}>
      <Spinner size="lg" label="Yükleniyor" />
    </span>
  );
}
