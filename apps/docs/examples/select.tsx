"use client";

import { useState } from "react";
import { Select } from "@meridui/react";

const stack = { display: "grid", gap: 8, width: 260 } as const;
const labelStyle = { fontSize: 14, fontWeight: 500, color: "var(--mrd-ink)" } as const;

export function SelectBasic() {
  return (
    <div style={stack}>
      <span id="select-basic-label" style={labelStyle}>
        Region
      </span>
      <Select.Root defaultValue="eu-west" name="region">
        <Select.Trigger aria-labelledby="select-basic-label" />
        <Select.Content>
          <Select.Item value="us-east">US East</Select.Item>
          <Select.Item value="us-west">US West</Select.Item>
          <Select.Item value="eu-west">EU West</Select.Item>
          <Select.Item value="ap-south" disabled>
            Asia Pacific (soon)
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
      <Select.Root value={plan} onValueChange={setPlan} placeholder="Choose a plan">
        <Select.Trigger aria-label="Plan" invalid={plan === ""} />
        <Select.Content>
          <Select.Item value="starter">Starter</Select.Item>
          <Select.Item value="team">Team</Select.Item>
          <Select.Item value="enterprise">Enterprise</Select.Item>
        </Select.Content>
      </Select.Root>
      <span style={{ fontSize: 14, color: "var(--mrd-muted)" }}>Value: {plan === "" ? "(none)" : plan}</span>
    </div>
  );
}


const SIZES = ["sm", "md", "lg"] as const;

export function SelectSizes() {
  return (
    <div style={stack}>
      {SIZES.map((size) => (
        <Select.Root key={size} defaultValue="weekly">
          <Select.Trigger size={size} aria-label={`Frequency (${size})`} />
          <Select.Content>
            <Select.Item value="daily">Daily</Select.Item>
            <Select.Item value="weekly">Weekly</Select.Item>
            <Select.Item value="monthly">Monthly</Select.Item>
          </Select.Content>
        </Select.Root>
      ))}
      <Select.Root disabled placeholder="Disabled">
        <Select.Trigger aria-label="Disabled select" />
        <Select.Content>
          <Select.Item value="x">Unavailable</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}

