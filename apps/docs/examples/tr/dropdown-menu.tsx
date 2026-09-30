"use client";

import { useState } from "react";
import { Button, DropdownMenu } from "@merid/react";


export function DropdownMenuBasic() {
  const [last, setLast] = useState("henüz yok");
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">İşlemler</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item trailing="⌘E" onSelect={() => setLast("Düzenle")}>Düzenle</DropdownMenu.Item>
          <DropdownMenu.Item trailing="⌘D" onSelect={() => setLast("Çoğalt")}>Çoğalt</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Taşı…</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={() => setLast("Arşivle")}>Arşivle</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <p style={{ margin: 0, color: "var(--mrd-muted)", fontSize: 14 }}>Son işlem: {last}</p>
    </div>
  );
}


export function DropdownMenuCheckboxes() {
  const [grid, setGrid] = useState(true);
  return (
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
    </DropdownMenu.Root>
  );
}


export function DropdownMenuPlacement() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Üstte, sona hizalı açılır</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content placement="top-end" sideOffset={8}>
        <DropdownMenu.Item>Yeniden adlandır</DropdownMenu.Item>
        <DropdownMenu.Item>Paylaş</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
