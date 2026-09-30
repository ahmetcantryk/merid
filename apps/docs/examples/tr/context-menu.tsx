"use client";

import { useState } from "react";
import { Button, ContextMenu } from "@meridui/react";

const areaStyle = {
  display: "grid",
  placeItems: "center",
  width: "100%",
  maxWidth: 420,
  height: 160,
  border: "1px dashed var(--mrd-line-strong)",
  borderRadius: 14,
  color: "var(--mrd-muted)",
  fontSize: 14,
  textAlign: "center" as const,
};

export function ContextMenuBasic() {
  const [last, setLast] = useState("henüz yok");
  const [pinned, setPinned] = useState(false);
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center", width: "100%" }}>
      <ContextMenu.Root label="Dosya işlemleri">
        <ContextMenu.Trigger style={areaStyle}>
          <Button variant="ghost">ceyrek-raporu.pdf</Button>
          <span>Buraya sağ tıkla ya da dosyaya focus verip Shift+F10'a bas</span>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item trailing="↵" onSelect={() => setLast("Aç")}>Aç</ContextMenu.Item>
          <ContextMenu.Item onSelect={() => setLast("Yeniden adlandır")}>Yeniden adlandır</ContextMenu.Item>
          <ContextMenu.Item disabled>Taşı…</ContextMenu.Item>
          <ContextMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>Sabitlendi</ContextMenu.CheckboxItem>
          <ContextMenu.Separator />
          <ContextMenu.Item onSelect={() => setLast("Sil")}>Sil</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <p style={{ margin: 0, color: "var(--mrd-muted)", fontSize: 14 }}>Son işlem: {last}</p>
    </div>
  );
}
