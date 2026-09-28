export const dropdownMenuBasicCode = `import { Button, DropdownMenu } from "@merid/react";

export function Example() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item trailing="⌘E" onSelect={() => edit()}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item trailing="⌘D" onSelect={() => duplicate()}>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Move to…</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={() => archive()}>Archive</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}`;

export const dropdownMenuCheckboxesCode = `const [grid, setGrid] = useState(true);

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
</DropdownMenu.Root>`;

export const dropdownMenuPlacementCode = `<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <Button variant="secondary">Opens above, aligned end</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content placement="top-end" sideOffset={8}>
    <DropdownMenu.Item>Rename</DropdownMenu.Item>
    <DropdownMenu.Item>Share</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>`;
