"use client";

import { useState } from "react";
import { Button, DropdownMenu } from "@meridui/react";


export function DropdownMenuBasic() {
  const [last, setLast] = useState("nothing yet");
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">Actions</Button>
        </DropdownMenu.Trigger>
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
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">View</Button>
      </DropdownMenu.Trigger>
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
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Opens above, aligned end</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content placement="top-end" sideOffset={8}>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
        <DropdownMenu.Item>Share</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

