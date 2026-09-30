export const toolbarBasicCode = `import { DropdownMenu, Toolbar, VisuallyHidden } from "@meridui/react";

export function Example() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  return (
    <Toolbar.Root aria-label="Metin biçimlendirme">
      <Toolbar.Group aria-label="Stil">
        <Toolbar.Button aria-pressed={bold} onClick={() => setBold(!bold)}>
          <strong aria-hidden="true">K</strong>
          <VisuallyHidden>Kalın</VisuallyHidden>
        </Toolbar.Button>
        <Toolbar.Button aria-pressed={italic} onClick={() => setItalic(!italic)}>
          <em aria-hidden="true">İ</em>
          <VisuallyHidden>İtalik</VisuallyHidden>
        </Toolbar.Button>
        <Toolbar.Button disabled>
          <s aria-hidden="true">Ü</s>
          <VisuallyHidden>Üstü çizili</VisuallyHidden>
        </Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Toolbar.Button>Hizala: {align}</Toolbar.Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>{/* Sola, Ortaya, Sağa */}</DropdownMenu.Content>
      </DropdownMenu.Root>
      <Toolbar.Separator />
      <Toolbar.Link href="/help/formatting">Yardım</Toolbar.Link>
    </Toolbar.Root>
  );
}`;
