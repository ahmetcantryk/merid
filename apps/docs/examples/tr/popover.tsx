"use client";

import { useState } from "react";
import { Button, Popover } from "@merid/react";

export function PopoverDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary">Paylaş</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Paylaş">
        <p style={{ margin: 0 }}>Linke sahip olan herkes bu sayfayı görüntüleyebilir.</p>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <Popover.Close asChild>
            <Button variant="primary" size="sm">Linki kopyala</Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

const PLACEMENTS = ["top", "right", "bottom", "left"] as const;

const PLACEMENT_LABELS: Record<(typeof PLACEMENTS)[number], string> = {
  top: "Üstte",
  right: "Sağda",
  bottom: "Altta",
  left: "Solda",
};

export function PopoverPlacementDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {PLACEMENTS.map((placement) => (
        <Popover.Root key={placement}>
          <Popover.Trigger asChild>
            <Button variant="secondary" size="sm">{placement}</Button>
          </Popover.Trigger>
          <Popover.Content placement={placement} aria-label={PLACEMENT_LABELS[placement]}>
            {PLACEMENT_LABELS[placement]}
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}

export function PopoverControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button variant="secondary">Ayrıntılar</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="Ayrıntılar">Açık: {String(open)}</Popover.Content>
      </Popover.Root>
      <span>{open ? "Açık" : "Kapalı"}</span>
    </div>
  );
}
