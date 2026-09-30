"use client";

import { useState } from "react";
import { Field, PinInput } from "@meridui/react";

const stack = { display: "grid", gap: 8, justifyItems: "start" } as const;
const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;

export function PinInputBasic() {
  const [code, setCode] = useState("");
  const [done, setDone] = useState<string | null>(null);
  return (
    <div style={stack}>
      <Field label="Verification code" description="We sent a 6-digit code to your phone.">
        <PinInput value={code} onValueChange={setCode} onComplete={setDone} name="otp" />
      </Field>
      <span style={note}>{done ? `Submitted ${done}` : `Typed: ${code || "—"}`}</span>
    </div>
  );
}

export function PinInputVariants() {
  return (
    <div style={stack}>
      <PinInput aria-label="PIN" length={4} mask size="lg" />
      <PinInput aria-label="Invite code" length={5} type="alphanumeric" placeholder="·" />
      <PinInput aria-label="Invalid code" length={4} defaultValue="1234" invalid />
    </div>
  );
}
