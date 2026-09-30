export const dropdownMenuBasicCode = `import { Button, DropdownMenu } from "@merid/react";

export function Example() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">İşlemler</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item trailing="⌘E" onSelect={() => edit()}>Düzenle</DropdownMenu.Item>
        <DropdownMenu.Item trailing="⌘D" onSelect={() => duplicate()}>Çoğalt</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Taşı…</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={() => archive()}>Arşivle</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}`;

export const dropdownMenuCheckboxesCode = `const [grid, setGrid] = useState(true);

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <Button variant="secondary">Görünüm</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>Ekran</DropdownMenu.Label>
    <DropdownMenu.CheckboxItem checked={grid} onCheckedChange={setGrid}>
      Izgarayı göster
    </DropdownMenu.CheckboxItem>
    <DropdownMenu.CheckboxItem defaultChecked>Kılavuzlara hizala</DropdownMenu.CheckboxItem>
    <DropdownMenu.CheckboxItem>Cetvelleri göster</DropdownMenu.CheckboxItem>
  </DropdownMenu.Content>
</DropdownMenu.Root>`;

export const dropdownMenuPlacementCode = `<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <Button variant="secondary">Üstte, sona hizalı açılır</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content placement="top-end" sideOffset={8}>
    <DropdownMenu.Item>Yeniden adlandır</DropdownMenu.Item>
    <DropdownMenu.Item>Paylaş</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>`;
