"use client";

import { Input, Label } from "@meridui/react";

const col = { display: "grid", gap: 8, width: "100%", maxWidth: 320 } as const;

export function LabelDemo() {
  return (
    <div style={col}>
      <Label htmlFor="label-email">E-posta</Label>
      <Input id="label-email" type="email" placeholder="sen@sirket.com" />
    </div>
  );
}

export function LabelRequired() {
  return (
    <div style={col}>
      <Label htmlFor="label-name" required>
        Ad soyad
      </Label>
      <Input id="label-name" required />
    </div>
  );
}

export function LabelDisabled() {
  return (
    <div style={col}>
      <Label htmlFor="label-workspace" disabled>
        Çalışma alanı
      </Label>
      <Input id="label-workspace" defaultValue="acme" disabled />
    </div>
  );
}
