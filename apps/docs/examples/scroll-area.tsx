"use client";

import { Badge, ScrollArea } from "@meridui/react";

const releases = Array.from({ length: 24 }, (_, i) => `v0.${24 - i}.0 — ${i % 3 === 0 ? "New components" : i % 3 === 1 ? "Bug fixes" : "Docs and tokens"}`);
const tags = ["react", "css", "tokens", "accessibility", "rtl", "dark mode", "density", "server components", "forms", "overlays", "tables"];

export function ScrollAreaBasic() {
  return (
    <ScrollArea
      maxHeight={200}
      label="Release history"
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
    <ScrollArea orientation="horizontal" autoHide label="Tags" style={{ width: "100%", maxWidth: 360 }}>
      <div style={{ display: "flex", gap: 8, paddingBlock: 8, width: "max-content" }}>
        {tags.map((tag) => (
          <Badge key={tag}>
            {tag}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
}
