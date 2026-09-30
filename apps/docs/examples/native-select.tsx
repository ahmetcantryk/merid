"use client";

import { useState } from "react";
import { Field, NativeSelect } from "@meridui/react";

const wrap = { width: "100%", maxWidth: 320 };

export function NativeSelectDemo() {
  return (
    <div style={wrap}>
      <NativeSelect aria-label="Country" placeholder="Choose a country">
        <option value="tr">Türkiye</option>
        <option value="de">Germany</option>
        <option value="nl">Netherlands</option>
      </NativeSelect>
    </div>
  );
}

export function NativeSelectSizes() {
  return (
    <div style={{ ...wrap, display: "grid", gap: 12 }}>
      <NativeSelect aria-label="Small" size="sm" defaultValue="a">
        <option value="a">Small</option>
      </NativeSelect>
      <NativeSelect aria-label="Medium" size="md" defaultValue="a">
        <option value="a">Medium</option>
      </NativeSelect>
      <NativeSelect aria-label="Large" size="lg" defaultValue="a">
        <option value="a">Large</option>
      </NativeSelect>
    </div>
  );
}

export function NativeSelectField() {
  return (
    <div style={wrap}>
      <Field label="Plan" description="You can change plans at any time." required>
        <NativeSelect placeholder="Select a plan">
          <option value="free">Free</option>
          <option value="team">Team</option>
          <option value="business">Business</option>
        </NativeSelect>
      </Field>
    </div>
  );
}

export function NativeSelectStates() {
  return (
    <div style={{ ...wrap, display: "grid", gap: 16 }}>
      <Field label="Region" error="Pick a region to continue.">
        <NativeSelect placeholder="Select a region">
          <option value="eu">Europe</option>
          <option value="us">United States</option>
        </NativeSelect>
      </Field>
      <Field label="Currency" disabled>
        <NativeSelect defaultValue="eur">
          <option value="eur">EUR</option>
        </NativeSelect>
      </Field>
    </div>
  );
}

export function NativeSelectControlled() {
  const [value, setValue] = useState("weekly");
  return (
    <div style={wrap}>
      <Field label="Digest frequency" description={`Current value: ${value}`}>
        <NativeSelect value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </NativeSelect>
      </Field>
    </div>
  );
}
