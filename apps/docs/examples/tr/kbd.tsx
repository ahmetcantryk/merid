"use client";

import { Kbd, Text } from "@merid/react";

export function KbdDemo() {
  return (
    <Text>
      Aramak için <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> tuşlarına bas.
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
