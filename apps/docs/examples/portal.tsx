"use client";

import { useState } from "react";
import { Button, Portal } from "@meridui/react";

const bannerStyle = {
  position: "fixed",
  bottom: 24,
  left: "50%",
  transform: "translateX(-50%)",
  padding: "10px 16px",
  borderRadius: 12,
  background: "var(--mrd-surface)",
  color: "var(--mrd-ink)",
  boxShadow: "var(--mrd-shadow-lg)",
  zIndex: 50,
} as const;

export function PortalBasic() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen((o) => !o)}>{open ? "Remove" : "Render"} banner</Button>
      {open ? (
        <Portal>
          <div role="status" style={bannerStyle}>
            Rendered into document.body
          </div>
        </Portal>
      ) : null}
    </>
  );
}

export function PortalContainer() {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <p style={{ margin: 0 }}>Declared above, rendered in the box:</p>
      <div
        ref={setTarget}
        style={{ padding: 16, minWidth: 240, borderRadius: 12, border: "1px dashed var(--mrd-line-strong)" }}
      />
      <Portal container={target}>Placed inside the target box</Portal>
    </div>
  );
}
