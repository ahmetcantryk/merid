import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0f1219";
const BODY = "#535a67";
const LINE = "#e6e8ec";
const ACCENT = "#3f63f5";

function logoDataUri(): string {
  const svg = readFileSync(join(process.cwd(), "public/brand/logo-light.svg"), "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Hairline frame with registration crosses at the corners: the same drawing-board motif as the landing hero. */
export default function OpengraphImage() {
  const cross = (left: number, top: number) => (
    <div key={`${left}-${top}`} style={{ position: "absolute", left: left - 8, top: top - 8, width: 17, height: 17, display: "flex" }}>
      <div style={{ position: "absolute", left: 8, top: 0, width: 1, height: 17, background: INK }} />
      <div style={{ position: "absolute", left: 0, top: 8, width: 17, height: 1, background: INK }} />
    </div>
  );
  return new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", background: "#ffffff", color: INK }}>
        <div style={{ position: "absolute", left: 64, top: 0, width: 1, height: 630, background: LINE }} />
        <div style={{ position: "absolute", left: 1136, top: 0, width: 1, height: 630, background: LINE }} />
        <div style={{ position: "absolute", left: 0, top: 64, width: 1200, height: 1, background: LINE }} />
        <div style={{ position: "absolute", left: 0, top: 566, width: 1200, height: 1, background: LINE }} />
        {cross(64, 64)}
        {cross(1136, 64)}
        {cross(64, 566)}
        {cross(1136, 566)}
        <div style={{ position: "absolute", left: 112, top: 112, display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUri()} width={218} height={38} alt="" />
        </div>
        <div style={{ position: "absolute", left: 112, top: 250, display: "flex", flexDirection: "column", gap: 26 }}>
          <span style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1.05, maxWidth: 900 }}>
            Quiet, precise components for React.
          </span>
          <span style={{ fontSize: 26, color: BODY }}>Plain CSS · design tokens · WCAG 2.2 AA · MIT</span>
        </div>
        <div style={{ position: "absolute", left: 112, top: 566, width: 180, height: 1, background: ACCENT }} />
      </div>
    ),
    size,
  );
}
