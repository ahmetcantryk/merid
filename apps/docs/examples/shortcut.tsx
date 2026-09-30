"use client";

import { Shortcut, Text } from "@merid/react";

export function ShortcutBasic() {
  return (
    <Text>
      Press <Shortcut keys={["mod", "k"]} /> to search, or <Shortcut keys={["mod", "shift", "p"]} /> for commands.
    </Text>
  );
}

export function ShortcutPlatforms() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      <Shortcut keys={["mod", "shift", "z"]} platform="mac" />
      <Shortcut keys={["mod", "shift", "z"]} platform="other" />
      <Shortcut keys={["alt", "arrowup"]} platform="mac" size="sm" />
      <Shortcut keys={["alt", "arrowup"]} platform="other" size="sm" />
    </div>
  );
}
