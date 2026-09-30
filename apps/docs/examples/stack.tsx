"use client";

import { Stack } from "@meridui/react";
import { Box } from "./layout-box";

export function StackDemo() {
  return (
    <Stack gap={3} style={{ width: "100%", maxWidth: 320 }}>
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
    </Stack>
  );
}

export function StackRow() {
  return (
    <Stack direction="row" gap={2} style={{ width: "100%" }}>
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
    </Stack>
  );
}

export function StackAlign() {
  return (
    <Stack direction="row" gap={2} align="center" justify="between" style={{ width: "100%" }}>
      <Box height={32}>short</Box>
      <Box height={72}>tall</Box>
      <Box height={48}>mid</Box>
    </Stack>
  );
}

const TAGS = ["Design", "Tokens", "React", "CSS", "Accessibility", "Dark mode"];

export function StackWrap() {
  return (
    <Stack direction="row" gap={2} wrap style={{ width: "100%", maxWidth: 300 }}>
      {TAGS.map((tag) => (
        <Box key={tag}>{tag}</Box>
      ))}
    </Stack>
  );
}

export function StackAs() {
  return (
    <Stack as="ul" gap={1} style={{ width: "100%", maxWidth: 320, listStyle: "none", padding: 0, margin: 0 }}>
      <li>
        <Box>First item</Box>
      </li>
      <li>
        <Box>Second item</Box>
      </li>
    </Stack>
  );
}
