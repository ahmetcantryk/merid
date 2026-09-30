"use client";

import { Spinner, Stack, Text } from "@meridui/react";

export function SpinnerDemo() {
  return <Spinner />;
}

export function SpinnerSizes() {
  return (
    <>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </>
  );
}

export function SpinnerWithText() {
  return (
    <Stack direction="row" gap={2} align="center">
      <Spinner size="sm" label={null} />
      <Text size="sm" as="span">
        Loading invoices…
      </Text>
    </Stack>
  );
}

export function SpinnerColor() {
  return (
    <span style={{ color: "var(--mrd-accent)" }}>
      <Spinner size="lg" label="Uploading" />
    </span>
  );
}
