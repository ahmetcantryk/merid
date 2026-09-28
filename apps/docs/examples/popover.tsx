"use client";

import { useState } from "react";
import { Popover } from "@merid/react";

export function PopoverDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger className="mrd-button" data-variant="secondary" data-size="md">
        Share
      </Popover.Trigger>
      <Popover.Content aria-label="Share">
        <p style={{ margin: 0 }}>Anyone with the link can view this page.</p>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <Popover.Close className="mrd-button" data-variant="primary" data-size="sm">
            Copy link
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
          <Popover.Trigger className="mrd-button" data-variant="secondary" data-size="sm">
            {placement}
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
        <Popover.Trigger className="mrd-button" data-variant="secondary" data-size="md">
          Details
        </Popover.Trigger>
        <Popover.Content aria-label="Details">Open: {String(open)}</Popover.Content>
      </Popover.Root>
      <span>{open ? "Open" : "Closed"}</span>
    </div>
  );
}
