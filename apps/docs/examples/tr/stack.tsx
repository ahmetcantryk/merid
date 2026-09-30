"use client";

import { Stack } from "@merid/react";
import { Box } from "../layout-box";

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
      <Box height={32}>kısa</Box>
      <Box height={72}>uzun</Box>
      <Box height={48}>orta</Box>
    </Stack>
  );
}

const TAGS = ["Tasarım", "Token'lar", "React", "CSS", "Erişilebilirlik", "Dark mode"];

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
        <Box>Birinci öğe</Box>
      </li>
      <li>
        <Box>İkinci öğe</Box>
      </li>
    </Stack>
  );
}
