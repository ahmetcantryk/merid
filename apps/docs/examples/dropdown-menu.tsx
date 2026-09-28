"use client";

import { useState } from "react";
import { DropdownMenu } from "@merid/react";

const triggerProps = { className: "mrd-button", "data-variant": "secondary", "data-size": "md" } as const;

export function DropdownMenuBasic() {
  const [last, setLast] = useState("nothing yet");
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger {...triggerProps}>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item trailing="⌘E" onSelect={() => setLast("Edit")}>Edit</DropdownMenu.Item>
          <DropdownMenu.Item trailing="⌘D" onSelect={() => setLast("Duplicate")}>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Move to…</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={() => setLast("Archive")}>Archive</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <p style={{ margin: 0, color: "var(--mrd-muted)", fontSize: 14 }}>Last action: {last}</p>
    </div>
  );
}


export function DropdownMenuCheckboxes() {
  const [grid, setGrid] = useState(true);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger {...triggerProps}>View</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Display</DropdownMenu.Label>
        <DropdownMenu.CheckboxItem checked={grid} onCheckedChange={setGrid}>
          Show grid
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem defaultChecked>Snap to guides</DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem>Show rulers</DropdownMenu.CheckboxItem>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}


export function DropdownMenuPlacement() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger {...triggerProps}>Opens above, aligned end</DropdownMenu.Trigger>
      <DropdownMenu.Content placement="top-end" sideOffset={8}>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
        <DropdownMenu.Item>Share</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

