"use client";

import { useState } from "react";
import { Field, NumberInput } from "@meridui/react";

const stack = { display: "grid", gap: 8, width: 240 } as const;
const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;

export function NumberInputBasic() {
  const [value, setValue] = useState<number | null>(1);
  return (
    <div style={stack}>
      <Field label="Seats">
        <NumberInput value={value} onValueChange={setValue} min={1} max={50} name="seats" />
      </Field>
      <span style={note}>value: {String(value)}</span>
    </div>
  );
}

export function NumberInputFormats() {
  return (
    <div style={stack}>
      <Field label="Price">
        <NumberInput defaultValue={1499.9} step={0.5} locale="en-US" formatOptions={{ style: "currency", currency: "USD" }} />
      </Field>
      <Field label="Discount">
        <NumberInput defaultValue={0.15} step={0.01} min={0} max={1} formatOptions={{ style: "percent" }} />
      </Field>
      <Field label="Weight">
        <NumberInput defaultValue={2.5} step={0.1} locale="de-DE" formatOptions={{ style: "unit", unit: "kilogram" }} />
      </Field>
    </div>
  );
}

export function NumberInputStates() {
  return (
    <div style={stack}>
      <NumberInput aria-label="Small" size="sm" defaultValue={3} />
      <NumberInput aria-label="No stepper" hideStepper defaultValue={10} />
      <NumberInput aria-label="Invalid" invalid defaultValue={-1} />
      <NumberInput aria-label="Disabled" disabled defaultValue={5} />
    </div>
  );
}
