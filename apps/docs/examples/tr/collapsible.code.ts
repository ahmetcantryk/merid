export const collapsibleBasicCode = `import { Collapsible, Text } from "@meridui/react";

export function Example() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Build ayrıntılarını göster</Collapsible.Trigger>
      <Collapsible.Content>
        <Text tone="muted">
          Build 1024, 2 dk 14 sn'de tamamlandı. 312 test geçti, 0 başarısız. eu-central'a deploy edildi.
        </Text>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}`;

export const collapsibleControlledCode = `const [open, setOpen] = useState(false);

<Collapsible.Root open={open} onOpenChange={setOpen}>
  <Collapsible.Trigger asChild>
    <Button variant="secondary" size="sm">
      {open ? "3 repository'yi gizle" : "3 repository daha göster"}
    </Button>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <ul>
      <li>northwind-web</li>
      <li>northwind-api</li>
      <li>northwind-docs</li>
    </ul>
  </Collapsible.Content>
</Collapsible.Root>`;
