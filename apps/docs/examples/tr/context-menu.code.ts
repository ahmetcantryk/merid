export const contextMenuBasicCode = `import { Button, ContextMenu } from "@meridui/react";

export function Example() {
  const [pinned, setPinned] = useState(false);
  return (
    <ContextMenu.Root label="Dosya işlemleri">
      <ContextMenu.Trigger className="file-area">
        <Button variant="ghost">ceyrek-raporu.pdf</Button>
        <span>Buraya sağ tıkla ya da dosyaya focus verip Shift+F10'a bas</span>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item trailing="↵" onSelect={() => open()}>Aç</ContextMenu.Item>
        <ContextMenu.Item onSelect={() => rename()}>Yeniden adlandır</ContextMenu.Item>
        <ContextMenu.Item disabled>Taşı…</ContextMenu.Item>
        <ContextMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>Sabitlendi</ContextMenu.CheckboxItem>
        <ContextMenu.Separator />
        <ContextMenu.Item onSelect={() => remove()}>Sil</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}`;
