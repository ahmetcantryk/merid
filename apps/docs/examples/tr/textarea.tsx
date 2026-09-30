"use client";

import { useState } from "react";
import { Text, Textarea } from "@meridui/react";

const col = { display: "grid", gap: 12, width: "100%", maxWidth: 420 } as const;

export function TextareaDemo() {
  return (
    <div style={col}>
      <Textarea aria-label="Mesaj" placeholder="Bir mesaj yaz…" />
    </div>
  );
}

export function TextareaResize() {
  return (
    <div style={col}>
      <Textarea aria-label="Dikey" rows={2} placeholder="resize vertical (varsayılan)" />
      <Textarea aria-label="Yok" rows={2} resize="none" placeholder="resize none" />
      <Textarea aria-label="İki yönde" rows={2} resize="both" placeholder="resize both" />
    </div>
  );
}

export function TextareaStates() {
  return (
    <div style={col}>
      <Textarea aria-label="Geçersiz" rows={2} invalid defaultValue="Çok kısa" />
      <Textarea aria-label="Devre dışı" rows={2} disabled defaultValue="Devre dışı" />
    </div>
  );
}

const MAX = 140;

export function TextareaControlled() {
  const [value, setValue] = useState("");
  return (
    <div style={col}>
      <Textarea
        aria-label="Durum"
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
