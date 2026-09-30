"use client";

import { useState } from "react";
import { Text, Textarea } from "@meridui/react";

const col = { display: "grid", gap: 12, width: "100%", maxWidth: 420 } as const;

export function TextareaDemo() {
  return (
    <div style={col}>
      <Textarea aria-label="Message" placeholder="Write a message…" />
    </div>
  );
}

export function TextareaResize() {
  return (
    <div style={col}>
      <Textarea aria-label="Vertical" rows={2} placeholder="resize vertical (default)" />
      <Textarea aria-label="None" rows={2} resize="none" placeholder="resize none" />
      <Textarea aria-label="Both" rows={2} resize="both" placeholder="resize both" />
    </div>
  );
}

export function TextareaStates() {
  return (
    <div style={col}>
      <Textarea aria-label="Invalid" rows={2} invalid defaultValue="Too short" />
      <Textarea aria-label="Disabled" rows={2} disabled defaultValue="Disabled" />
    </div>
  );
}

const MAX = 140;

export function TextareaControlled() {
  const [value, setValue] = useState("");
  return (
    <div style={col}>
      <Textarea
        aria-label="Status"
        value={value}
        maxLength={MAX}
        onChange={(event) => setValue(event.target.value)}
      />
      <Text size="xs" tone="muted" numeric>
        {value.length} / {MAX}
      </Text>
    </div>
  );
}
