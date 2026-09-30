"use client";

import { useState } from "react";
import { Field, NumberInput } from "@meridui/react";

const stack = { display: "grid", gap: 8, width: 240 } as const;
const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;

/** Türkçe biçim ve buton etiketleri. */
const tr = { locale: "tr-TR", incrementLabel: "Artır", decrementLabel: "Azalt" } as const;

export function NumberInputBasic() {
  const [value, setValue] = useState<number | null>(1);
  return (
    <div style={stack}>
      <Field label="Koltuk sayısı">
        <NumberInput {...tr} value={value} onValueChange={setValue} min={1} max={50} name="seats" />
      </Field>
      <span style={note}>değer: {String(value)}</span>
    </div>
  );
}

export function NumberInputFormats() {
  return (
    <div style={stack}>
      <Field label="Fiyat">
        <NumberInput {...tr} defaultValue={1499.9} step={0.5} formatOptions={{ style: "currency", currency: "TRY" }} />
      </Field>
      <Field label="İndirim">
        <NumberInput {...tr} defaultValue={0.15} step={0.01} min={0} max={1} formatOptions={{ style: "percent" }} />
      </Field>
      <Field label="Ağırlık">
        <NumberInput {...tr} defaultValue={2.5} step={0.1} formatOptions={{ style: "unit", unit: "kilogram" }} />
      </Field>
    </div>
  );
}

export function NumberInputStates() {
  return (
    <div style={stack}>
      <NumberInput {...tr} aria-label="Küçük" size="sm" defaultValue={3} />
      <NumberInput {...tr} aria-label="Butonsuz" hideStepper defaultValue={10} />
      <NumberInput {...tr} aria-label="Geçersiz" invalid defaultValue={-1} />
      <NumberInput {...tr} aria-label="Devre dışı" disabled defaultValue={5} />
    </div>
  );
}
