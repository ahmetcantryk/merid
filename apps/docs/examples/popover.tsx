"use client";

import { useState } from "react";
import { Button, Popover } from "@merid/react";

export function PopoverDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary">Share</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Share">
        <p style={{ margin: 0 }}>Anyone with the link can view this page.</p>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <Popover.Close asChild>
            <Button variant="primary" size="sm">Copy link</Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

const PLACEMENTS = ["top", "right", "bottom", "left"] as const;

export function PopoverPlacementDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {PLACEMENTS.map((placement) => (
        <Popover.Root key={placement}>
          <Popover.Trigger asChild>
            <Button variant="secondary" size="sm">{placement}</Button>
          </Popover.Trigger>
          <Popover.Content placement={placement} aria-label={`Placed ${placement}`}>
            Placed {placement}
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
          <Button variant="secondary">Details</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="Details">Open: {String(open)}</Popover.Content>
      </Popover.Root>
      <span>{open ? "Open" : "Closed"}</span>
    </div>
  );
}
