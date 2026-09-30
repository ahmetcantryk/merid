"use client";

import { Kbd, Text } from "@meridui/react";

export function KbdDemo() {
  return (
    <Text>
      Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> to search.
    </Text>
  );
}

export function KbdSizes() {
  return (
    <>
      <Kbd size="sm">Esc</Kbd>
      <Kbd size="md">Esc</Kbd>
    </>
  );
}

export function KbdChord() {
  return (
    <Text>
      <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>P</Kbd>
    </Text>
  );
}
