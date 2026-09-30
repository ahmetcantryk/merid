export const toolbarBasicCode = `import { DropdownMenu, Toolbar, VisuallyHidden } from "@meridui/react";

export function Example() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  return (
    <Toolbar.Root aria-label="Text formatting">
      <Toolbar.Group aria-label="Style">
        <Toolbar.Button aria-pressed={bold} onClick={() => setBold(!bold)}>
          <strong aria-hidden="true">B</strong>
          <VisuallyHidden>Bold</VisuallyHidden>
        </Toolbar.Button>
        <Toolbar.Button aria-pressed={italic} onClick={() => setItalic(!italic)}>
          <em aria-hidden="true">I</em>
          <VisuallyHidden>Italic</VisuallyHidden>
        </Toolbar.Button>
        <Toolbar.Button disabled>
          <s aria-hidden="true">S</s>
          <VisuallyHidden>Strikethrough</VisuallyHidden>
        </Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Toolbar.Button>Align: {align}</Toolbar.Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>{/* Left, Center, Right */}</DropdownMenu.Content>
      </DropdownMenu.Root>
      <Toolbar.Separator />
      <Toolbar.Link href="/help/formatting">Help</Toolbar.Link>
    </Toolbar.Root>
  );
}`;
