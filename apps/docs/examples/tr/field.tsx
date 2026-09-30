"use client";

import { useState } from "react";
import { Field, Input, NativeSelect, Textarea } from "@merid/react";

const wrap = { width: "100%", maxWidth: 360, display: "grid", gap: 20 } as const;

export function FieldDemo() {
  return (
    <div style={wrap}>
      <Field label="E-posta" description="Yalnızca makbuzlar için kullanıyoruz.">
        <Input type="email" placeholder="sen@sirket.com" />
      </Field>
    </div>
  );
}

export function FieldError() {
  return (
    <div style={wrap}>
      <Field label="Kullanıcı adı" error="Bu kullanıcı adı alınmış." required>
        <Input defaultValue="ahmet" />
      </Field>
    </div>
  );
}

export function FieldControlled() {
  const [name, setName] = useState("");
  const error = name.length > 0 && name.length < 3 ? "En az 3 karakter kullan." : undefined;
  return (
    <div style={wrap}>
      <Field label="Proje adı" description="Kenar çubuğunda görünür." error={error}>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
    </div>
  );
}

export function FieldUncontrolled() {
  return (
    <div style={wrap}>
      <Field label="Hakkında">
        <Textarea name="bio" defaultValue="İstanbul'da tasarımcı." />
      </Field>
    </div>
  );
}

export function FieldDisabled() {
  return (
    <div style={wrap}>
      <Field label="Plan" disabled>
        <NativeSelect defaultValue="team">
          <option value="free">Ücretsiz</option>
          <option value="team">Ekip</option>
        </NativeSelect>
      </Field>
    </div>
  );
}
