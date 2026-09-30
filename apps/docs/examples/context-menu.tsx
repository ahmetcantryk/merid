"use client";

import { useState } from "react";
import { Button, ContextMenu } from "@meridui/react";

const areaStyle = {
  display: "grid",
  placeItems: "center",
  width: "100%",
  maxWidth: 420,
  height: 160,
  border: "1px dashed var(--mrd-line-strong)",
  borderRadius: 14,
  color: "var(--mrd-muted)",
  fontSize: 14,
  textAlign: "center" as const,
};

export function ContextMenuBasic() {
  const [last, setLast] = useState("nothing yet");
  const [pinned, setPinned] = useState(false);
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center", width: "100%" }}>
      <ContextMenu.Root label="File actions">
        <ContextMenu.Trigger style={areaStyle}>
          <Button variant="ghost">quarterly-report.pdf</Button>
          <span>Right-click here, or focus the file and press Shift+F10</span>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item trailing="↵" onSelect={() => setLast("Open")}>Open</ContextMenu.Item>
          <ContextMenu.Item onSelect={() => setLast("Rename")}>Rename</ContextMenu.Item>
          <ContextMenu.Item disabled>Move to…</ContextMenu.Item>
          <ContextMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>Pinned</ContextMenu.CheckboxItem>
          <ContextMenu.Separator />
          <ContextMenu.Item onSelect={() => setLast("Delete")}>Delete</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <p style={{ margin: 0, color: "var(--mrd-muted)", fontSize: 14 }}>Last action: {last}</p>
    </div>
  );
}
