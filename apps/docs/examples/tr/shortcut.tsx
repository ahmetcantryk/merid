"use client";

import { Shortcut, Text } from "@merid/react";

export function ShortcutBasic() {
  return (
    <Text>
      Aramak için <Shortcut keys={["mod", "k"]} />, komutlar için <Shortcut keys={["mod", "shift", "p"]} /> tuşlarına bas.
    </Text>
  );
}

export function ShortcutPlatforms() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      <Shortcut keys={["mod", "shift", "z"]} platform="mac" />
      <Shortcut keys={["mod", "shift", "z"]} platform="other" />
      <Shortcut keys={["alt", "arrowup"]} platform="mac" size="sm" labels={{ arrowup: "Yukarı ok" }} />
      <Shortcut keys={["alt", "arrowup"]} platform="other" size="sm" labels={{ arrowup: "Yukarı ok" }} />
    </div>
  );
}
