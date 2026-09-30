"use client";

import { useState } from "react";
import { Field, PinInput } from "@meridui/react";

const stack = { display: "grid", gap: 8, justifyItems: "start" } as const;
const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;

/** Hücrelerin ekran okuyucu etiketi. */
const cellLabel = (index: number, length: number) => `${length} karakterden ${index}.`;

export function PinInputBasic() {
  const [code, setCode] = useState("");
  const [done, setDone] = useState<string | null>(null);
  return (
    <div style={stack}>
      <Field label="Doğrulama kodu" description="Telefonuna 6 haneli bir kod gönderdik.">
        <PinInput value={code} onValueChange={setCode} onComplete={setDone} getCellLabel={cellLabel} name="otp" />
      </Field>
      <span style={note}>{done ? `Gönderildi: ${done}` : `Yazılan: ${code || "—"}`}</span>
    </div>
  );
}

export function PinInputVariants() {
  return (
    <div style={stack}>
      <PinInput aria-label="PIN" length={4} mask size="lg" getCellLabel={cellLabel} />
      <PinInput aria-label="Davet kodu" length={5} type="alphanumeric" placeholder="·" getCellLabel={cellLabel} />
      <PinInput aria-label="Geçersiz kod" length={4} defaultValue="1234" invalid getCellLabel={cellLabel} />
    </div>
  );
}
