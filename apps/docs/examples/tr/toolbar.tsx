"use client";

import { useState } from "react";
import { DropdownMenu, Toolbar, VisuallyHidden } from "@merid/react";

const alignments = ["Sola", "Ortaya", "Sağa"];

export function ToolbarBasic() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [align, setAlign] = useState("Sola");
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
        <DropdownMenu.Content>
          {alignments.map((value) => (
            <DropdownMenu.Item key={value} onSelect={() => setAlign(value)}>
              {value}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Toolbar.Separator />
      <Toolbar.Link href="#formatting-help">Yardım</Toolbar.Link>
    </Toolbar.Root>
  );
}
