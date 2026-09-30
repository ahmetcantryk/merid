"use client";

import { Badge, ScrollArea } from "@meridui/react";

const releases = Array.from(
  { length: 24 },
  (_, i) => `v0.${24 - i}.0 — ${i % 3 === 0 ? "Yeni component'ler" : i % 3 === 1 ? "Hata düzeltmeleri" : "Dokümanlar ve token'lar"}`,
);
const tags = ["react", "css", "token", "erişilebilirlik", "rtl", "dark mode", "yoğunluk", "server component", "formlar", "overlay", "tablolar"];

export function ScrollAreaBasic() {
  return (
    <ScrollArea
      maxHeight={200}
      label="Sürüm geçmişi"
      style={{ width: "100%", maxWidth: 360, border: "1px solid var(--mrd-line)", borderRadius: 8 }}
    >
      <ul style={{ margin: 0, padding: "8px 12px", listStyle: "none", display: "grid", gap: 8, fontSize: 14 }}>
        {releases.map((release) => (
          <li key={release}>{release}</li>
        ))}
      </ul>
    </ScrollArea>
  );
}

export function ScrollAreaHorizontal() {
  return (
    <ScrollArea orientation="horizontal" autoHide label="Etiketler" style={{ width: "100%", maxWidth: 360 }}>
      <div style={{ display: "flex", gap: 8, paddingBlock: 8, width: "max-content" }}>
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </ScrollArea>
  );
}
