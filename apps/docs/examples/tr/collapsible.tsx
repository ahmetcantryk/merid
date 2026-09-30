"use client";

import { useState } from "react";
import { Button, Collapsible, Text } from "@merid/react";

export function CollapsibleBasic() {
  return (
    <Collapsible.Root style={{ width: "100%", maxWidth: 420 }}>
      <Collapsible.Trigger>Build ayrıntılarını göster</Collapsible.Trigger>
      <Collapsible.Content>
        <Text tone="muted" style={{ marginTop: 8 }}>
          Build 1024, 2 dk 14 sn'de tamamlandı. 312 test geçti, 0 başarısız. eu-central'a deploy edildi.
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
          {open ? "3 repository'yi gizle" : "3 repository daha göster"}
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
