"use client";

import { useState } from "react";
import { Input, Text } from "@merid/react";
import { SearchIcon } from "./icons";

const col = { display: "grid", gap: 12, width: "100%", maxWidth: 360 } as const;

export function InputDemo() {
  return (
    <div style={col}>
      <Input aria-label="Email" type="email" placeholder="you@company.com" />
    </div>
  );
}

export function InputSizes() {
  return (
    <div style={col}>
      <Input size="sm" aria-label="Small" placeholder="Small, 36px" />
      <Input size="md" aria-label="Medium" placeholder="Medium, 46px" />
      <Input size="lg" aria-label="Large" placeholder="Large, 50px" />
    </div>
  );
}

export function InputAddons() {
  return (
    <div style={col}>
      <Input aria-label="Search" leading={<SearchIcon />} placeholder="Search projects" />
      <Input aria-label="Amount" type="number" trailing="TRY" defaultValue="250" />
    </div>
  );
}

export function InputStates() {
  return (
    <div style={col}>
      <Input aria-label="Invalid" invalid defaultValue="not-an-email" />
      <Input aria-label="Disabled" disabled defaultValue="Disabled" />
      <Input aria-label="Read only" readOnly defaultValue="Read only" />
    </div>
  );
}

export function InputControlled() {
  const [value, setValue] = useState("");
  return (
    <div style={col}>
      <Input
        aria-label="Workspace URL"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="acme"
      />
      <Text size="xs" tone="muted">
        meridui.dev/{value || "…"}
      </Text>
    </div>
  );
}
