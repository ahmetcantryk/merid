"use client";

import { useState } from "react";
import { Input, Text } from "@meridui/react";
import { SearchIcon } from "../icons";

const col = { display: "grid", gap: 12, width: "100%", maxWidth: 360 } as const;

export function InputDemo() {
  return (
    <div style={col}>
      <Input aria-label="E-posta" type="email" placeholder="sen@sirket.com" />
    </div>
  );
}

export function InputSizes() {
  return (
    <div style={col}>
      <Input size="sm" aria-label="Küçük" placeholder="Küçük, 36px" />
      <Input size="md" aria-label="Orta" placeholder="Orta, 46px" />
      <Input size="lg" aria-label="Büyük" placeholder="Büyük, 50px" />
    </div>
  );
}

export function InputAddons() {
  return (
    <div style={col}>
      <Input aria-label="Ara" leading={<SearchIcon />} placeholder="Projelerde ara" />
      <Input aria-label="Tutar" type="number" trailing="TRY" defaultValue="250" />
    </div>
  );
}

export function InputStates() {
  return (
    <div style={col}>
      <Input aria-label="Geçersiz" invalid defaultValue="e-posta-degil" />
      <Input aria-label="Devre dışı" disabled defaultValue="Devre dışı" />
      <Input aria-label="Salt okunur" readOnly defaultValue="Salt okunur" />
    </div>
  );
}

export function InputControlled() {
  const [value, setValue] = useState("");
  return (
    <div style={col}>
      <Input
        aria-label="Çalışma alanı URL'si"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="acme"
      />
      <Text size="xs" tone="muted">
        meridui.dev/{value || "…"}
      </Text>
    </div>
  );
}
