export const contextMenuBasicCode = `import { Button, ContextMenu } from "@meridui/react";

export function Example() {
  const [pinned, setPinned] = useState(false);
  return (
    <ContextMenu.Root label="File actions">
      <ContextMenu.Trigger className="file-area">
        <Button variant="ghost">quarterly-report.pdf</Button>
        <span>Right-click here, or focus the file and press Shift+F10</span>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item trailing="↵" onSelect={() => open()}>Open</ContextMenu.Item>
        <ContextMenu.Item onSelect={() => rename()}>Rename</ContextMenu.Item>
        <ContextMenu.Item disabled>Move to…</ContextMenu.Item>
        <ContextMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>Pinned</ContextMenu.CheckboxItem>
        <ContextMenu.Separator />
        <ContextMenu.Item onSelect={() => remove()}>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}`;
