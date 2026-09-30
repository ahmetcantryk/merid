"use client";

import { useState } from "react";
import { Field, Input, NativeSelect, Textarea } from "@meridui/react";

const wrap = { width: "100%", maxWidth: 360, display: "grid", gap: 20 } as const;

export function FieldDemo() {
  return (
    <div style={wrap}>
      <Field label="Email" description="We only use it for receipts.">
        <Input type="email" placeholder="you@company.com" />
      </Field>
    </div>
  );
}

export function FieldError() {
  return (
    <div style={wrap}>
      <Field label="Username" error="That username is taken." required>
        <Input defaultValue="ahmet" />
      </Field>
    </div>
  );
}

export function FieldControlled() {
  const [name, setName] = useState("");
  const error = name.length > 0 && name.length < 3 ? "Use at least 3 characters." : undefined;
  return (
    <div style={wrap}>
      <Field label="Project name" description="Shown in the sidebar." error={error}>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
    </div>
  );
}

export function FieldUncontrolled() {
  return (
    <div style={wrap}>
      <Field label="Bio">
        <Textarea name="bio" defaultValue="Designer in Istanbul." />
      </Field>
    </div>
  );
}

export function FieldDisabled() {
  return (
    <div style={wrap}>
      <Field label="Plan" disabled>
        <NativeSelect defaultValue="team">
          <option value="free">Free</option>
          <option value="team">Team</option>
        </NativeSelect>
      </Field>
    </div>
  );
}
