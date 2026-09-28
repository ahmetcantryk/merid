"use client";

import { useState } from "react";
import { Radio, RadioGroup } from "@merid/react";

export function RadioDemo() {
  return (
    <RadioGroup aria-label="Plan" defaultValue="team">
      <Radio value="free">Free</Radio>
      <Radio value="team">Team</Radio>
      <Radio value="business">Business</Radio>
    </RadioGroup>
  );
}

export function RadioControlled() {
  const [value, setValue] = useState("standard");
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <RadioGroup aria-label="Shipping" value={value} onValueChange={setValue}>
        <Radio value="standard" description="3–5 business days">
          Standard
        </Radio>
        <Radio value="express" description="Next business day">
          Express
        </Radio>
      </RadioGroup>
      <span style={{ fontSize: 13, color: "var(--mrd-muted)" }}>value: {value}</span>
    </div>
  );
}

export function RadioHorizontal() {
  return (
    <RadioGroup aria-label="Billing period" orientation="horizontal" defaultValue="monthly">
      <Radio value="monthly">Monthly</Radio>
      <Radio value="yearly">Yearly</Radio>
    </RadioGroup>
  );
}

export function RadioStates() {
  return (
    <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
      <RadioGroup aria-label="Disabled group" disabled defaultValue="a">
        <Radio value="a">Disabled group</Radio>
        <Radio value="b">Also disabled</Radio>
      </RadioGroup>
      <RadioGroup aria-label="Size" defaultValue="m">
        <Radio value="s">Small</Radio>
        <Radio value="m">Medium</Radio>
        <Radio value="l" disabled>
          Large (sold out)
        </Radio>
      </RadioGroup>
      <RadioGroup aria-label="Invalid group" invalid required>
        <Radio value="yes">Yes</Radio>
        <Radio value="no">No</Radio>
      </RadioGroup>
    </div>
  );
}
