export const collapsibleBasicCode = `import { Collapsible, Text } from "@meridui/react";

export function Example() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Show build details</Collapsible.Trigger>
      <Collapsible.Content>
        <Text tone="muted">
          Build 1024 finished in 2m 14s. 312 tests passed, 0 failed. Deployed to eu-central.
        </Text>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}`;

export const collapsibleControlledCode = `const [open, setOpen] = useState(false);

<Collapsible.Root open={open} onOpenChange={setOpen}>
  <Collapsible.Trigger asChild>
    <Button variant="secondary" size="sm">
      {open ? "Hide" : "Show"} 3 more repositories
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
