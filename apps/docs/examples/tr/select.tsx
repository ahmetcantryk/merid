"use client";

import { useState } from "react";
import { Select } from "@meridui/react";

const stack = { display: "grid", gap: 8, width: 260 } as const;
const labelStyle = { fontSize: 14, fontWeight: 500, color: "var(--mrd-ink)" } as const;

export function SelectBasic() {
  return (
    <div style={stack}>
      <span id="select-basic-label" style={labelStyle}>
        Bölge
      </span>
      <Select.Root defaultValue="eu-west" name="region" placeholder="Seç…">
        <Select.Trigger aria-labelledby="select-basic-label" />
        <Select.Content>
          <Select.Item value="us-east">ABD Doğu</Select.Item>
          <Select.Item value="us-west">ABD Batı</Select.Item>
          <Select.Item value="eu-west">AB Batı</Select.Item>
          <Select.Item value="ap-south" disabled>
            Asya Pasifik (yakında)
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}


export function SelectControlled() {
  const [plan, setPlan] = useState("");
  return (
    <div style={stack}>
      <Select.Root value={plan} onValueChange={setPlan} placeholder="Paket seç">
        <Select.Trigger aria-label="Paket" invalid={plan === ""} />
        <Select.Content>
          <Select.Item value="starter">Başlangıç</Select.Item>
          <Select.Item value="team">Ekip</Select.Item>
          <Select.Item value="enterprise">Kurumsal</Select.Item>
        </Select.Content>
      </Select.Root>
      <span style={{ fontSize: 14, color: "var(--mrd-muted)" }}>Değer: {plan === "" ? "(yok)" : plan}</span>
    </div>
  );
}


const SIZES = ["sm", "md", "lg"] as const;

export function SelectSizes() {
  return (
    <div style={stack}>
      {SIZES.map((size) => (
        <Select.Root key={size} defaultValue="weekly">
          <Select.Trigger size={size} aria-label={`Sıklık (${size})`} />
          <Select.Content>
            <Select.Item value="daily">Günlük</Select.Item>
            <Select.Item value="weekly">Haftalık</Select.Item>
            <Select.Item value="monthly">Aylık</Select.Item>
          </Select.Content>
        </Select.Root>
      ))}
      <Select.Root disabled placeholder="Devre dışı">
        <Select.Trigger aria-label="Devre dışı select" />
        <Select.Content>
          <Select.Item value="x">Kullanılamıyor</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}

