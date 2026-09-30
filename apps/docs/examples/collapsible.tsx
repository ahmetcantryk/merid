"use client";

import { useState } from "react";
import { Button, Collapsible, Text } from "@meridui/react";

export function CollapsibleBasic() {
  return (
    <Collapsible.Root style={{ width: "100%", maxWidth: 420 }}>
      <Collapsible.Trigger>Show build details</Collapsible.Trigger>
      <Collapsible.Content>
        <Text tone="muted" style={{ marginTop: 8 }}>
          Build 1024 finished in 2m 14s. 312 tests passed, 0 failed. Deployed to eu-central.
        </Text>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function CollapsibleControlled() {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} style={{ display: "grid", gap: 8, width: "100%", maxWidth: 420 }}>
      <Collapsible.Trigger asChild>
        <Button variant="secondary" size="sm">
          {open ? "Hide" : "Show"} 3 more repositories
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <ul style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 4 }}>
          <li>northwind-web</li>
          <li>northwind-api</li>
          <li>northwind-docs</li>
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
