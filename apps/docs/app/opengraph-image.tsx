import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 88px",
          background: "#ffffff",
          color: "#0f1219",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9.25" stroke="#0f1219" strokeWidth="1.25" />
            <path d="M12 1.5C15.6 5 17 8.4 17 12s-1.4 7-5 10.5" stroke="#3f63f5" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.035em" }}>merid</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05, maxWidth: 900 }}>
            Quiet, precise components for React.
          </span>
          <span style={{ fontSize: 28, color: "#535a67" }}>Plain CSS · design tokens · WCAG 2.2 AA · MIT</span>
        </div>
        <div style={{ display: "flex", height: 1, background: "#e6e8ec", position: "relative" }}>
          <div style={{ width: 160, height: 1, background: "#3f63f5" }} />
        </div>
      </div>
    ),
    size,
  );
}
