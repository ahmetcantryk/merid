"use client";

import { useState } from "react";
import { Button, Portal } from "@merid/react";

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
      <Button onClick={() => setOpen((o) => !o)}>Banner'ı {open ? "kaldır" : "göster"}</Button>
      {open ? (
        <Portal>
          <div role="status" style={bannerStyle}>
            document.body içine render'landı
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
      <p style={{ margin: 0 }}>Yukarıda tanımlandı, kutunun içinde render'lanıyor:</p>
      <div
        ref={setTarget}
        style={{ padding: 16, minWidth: 240, borderRadius: 12, border: "1px dashed var(--mrd-line-strong)" }}
      />
      <Portal container={target}>Hedef kutunun içine yerleşti</Portal>
    </div>
  );
}
