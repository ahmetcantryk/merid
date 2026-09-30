"use client";

import { useState } from "react";
import { Button, Command, Shortcut } from "@meridui/react";

export function CommandBasic() {
  const [last, setLast] = useState("nothing yet");
  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 480 }}>
      <Command.Root onSelect={setLast}>
        <Command.Input />
        <Command.List>
          <Command.Empty />
          <Command.Group heading="Pages">
            <Command.Item keywords={["dashboard"]}>Home</Command.Item>
            <Command.Item>Projects</Command.Item>
            <Command.Item>Settings</Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="Actions">
            <Command.Item value="New project" shortcut={["mod", "shift", "p"]}>New project</Command.Item>
            <Command.Item value="Invite member" shortcut={["mod", "shift", "i"]}>Invite member</Command.Item>
            <Command.Item disabled>Delete workspace</Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Root>
      <p style={{ margin: 0, color: "var(--mrd-muted)", fontSize: 14 }}>Last command: {last}</p>
    </div>
  );
}

export function CommandDialogDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("nothing yet");
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open command menu <Shortcut keys={["mod", "j"]} size="sm" />
      </Button>
      <Command.Dialog open={open} onOpenChange={setOpen} onSelect={setLast} shortcut={["mod", "j"]}>
        <Command.Input placeholder="Search pages and actions…" />
        <Command.List>
          <Command.Empty>Nothing matches that search.</Command.Empty>
          <Command.Group heading="Pages">
            <Command.Item>Home</Command.Item>
            <Command.Item>Billing</Command.Item>
            <Command.Item>Team</Command.Item>
          </Command.Group>
          <Command.Group heading="Theme">
            <Command.Item value="Light theme">Light</Command.Item>
            <Command.Item value="Dark theme">Dark</Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
      <p style={{ margin: 0, color: "var(--mrd-muted)", fontSize: 14 }}>Last command: {last}</p>
    </div>
  );
}
