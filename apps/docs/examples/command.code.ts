export const commandBasicCode = `import { Command } from "@meridui/react";

export function Example() {
  return (
    <Command.Root onSelect={(value) => run(value)}>
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
  );
}`;

export const commandDialogCode = `const [open, setOpen] = useState(false);

<Button variant="secondary" onClick={() => setOpen(true)}>
  Open command menu <Shortcut keys={["mod", "j"]} size="sm" />
</Button>

{/* shortcut defaults to ⌘K / Ctrl+K; this site already uses that for search. */}
<Command.Dialog
  open={open}
  onOpenChange={setOpen}
  onSelect={(value) => run(value)}
  shortcut={["mod", "j"]}
>
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
</Command.Dialog>`;
