import type { CSSProperties, ReactNode } from "react";

const boxStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 48,
  padding: "8px 14px",
  borderRadius: 8,
  background: "var(--mrd-accent-soft)",
  color: "var(--mrd-accent-strong)",
  fontSize: 13,
  fontWeight: 500,
};

/** Visible placeholder box for layout demos. */
export function Box({ children, height = 48 }: { readonly children?: ReactNode; readonly height?: number }) {
  return <div style={{ ...boxStyle, minHeight: height }}>{children}</div>;
}
