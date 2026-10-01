import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import { brandColors } from "@/lib/brand-paths";
import { contourSheet } from "@/lib/contours";
import { getDictionary, type Locale } from "@/lib/i18n";

export const ogSize = { width: 1200, height: 630 };

const { ink: INK, body: BODY, line: LINE, lineStrong: LINE_STRONG, accent: ACCENT, paper: PAPER } = brandColors;

/** Static Archivo instances (SIL OFL 1.1, see assets/og-fonts): next/og reads TTF, not variable woff2. */
const FONT_DIR = join(process.cwd(), "assets/og-fonts");
const ttf = (file: string): ArrayBuffer => {
  const buf = readFileSync(join(FONT_DIR, file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
};
const fonts = [
  { name: "Archivo Expanded", data: ttf("Archivo-SemiBoldExpanded.ttf"), weight: 600 as const, style: "normal" as const },
  { name: "Archivo", data: ttf("Archivo-Regular.ttf"), weight: 400 as const, style: "normal" as const },
];

function logoDataUri(): string {
  const svg = readFileSync(join(process.cwd(), "public/brand/logo-light.svg"), "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** The map sheet on the right of every image: ticked neat line, contours, one meridian in the accent. */
const MAP = { x: 772, y: 64, w: 364, h: 502 };
function MapSheet() {
  const sheet = contourSheet(MAP.w, MAP.h);
  const ticks: ReactNode[] = [];
  for (let x = 0; x <= MAP.w; x += 14) {
    const long = x % 56 === 0;
    ticks.push(<line key={`t${x}`} x1={x} y1={0} x2={x} y2={long ? -8 : -4} stroke={long ? INK : LINE_STRONG} strokeWidth={1} />);
    ticks.push(<line key={`b${x}`} x1={x} y1={MAP.h} x2={x} y2={MAP.h + (long ? 8 : 4)} stroke={long ? INK : LINE_STRONG} strokeWidth={1} />);
  }
  for (let y = 0; y <= MAP.h; y += 14) {
    const long = y % 56 === 0;
    ticks.push(<line key={`l${y}`} x1={0} y1={y} x2={long ? -8 : -4} y2={y} stroke={long ? INK : LINE_STRONG} strokeWidth={1} />);
    ticks.push(<line key={`r${y}`} x1={MAP.w} y1={y} x2={MAP.w + (long ? 8 : 4)} y2={y} stroke={long ? INK : LINE_STRONG} strokeWidth={1} />);
  }
  const meridian = Math.round(MAP.w * 0.34);
  return (
    <svg
      width={MAP.w + 20}
      height={ogSize.height}
      viewBox={`-10 ${-MAP.y} ${MAP.w + 20} ${ogSize.height}`}
      style={{ position: "absolute", left: MAP.x - 10, top: 0 }}
    >
      {sheet.paths.map((d, level) => (
        <path key={level} d={d} fill="none" stroke={sheet.isIndex(level) ? BODY : LINE_STRONG} strokeWidth={sheet.isIndex(level) ? 1.1 : 0.8} />
      ))}
      <rect x={0.5} y={0.5} width={MAP.w - 1} height={MAP.h - 1} fill="none" stroke={INK} strokeWidth={1} />
      {ticks}
      <line x1={meridian} y1={-MAP.y} x2={meridian} y2={ogSize.height - MAP.y} stroke={ACCENT} strokeWidth={2} />
    </svg>
  );
}

function Frame({ children }: { readonly children: ReactNode }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", background: PAPER, color: INK, fontFamily: "Archivo" }}>
      <div style={{ position: "absolute", left: 0, top: 565, width: 1200, height: 1, background: LINE }} />
      <div style={{ position: "absolute", left: 72, top: 72, display: "flex" }}>
        <img src={logoDataUri()} width={195} height={34} alt="" />
      </div>
      {children}
      <MapSheet />
    </div>
  );
}

/** Site-wide image: the hero headline and one line under it. */
export function renderOgImage(locale: Locale) {
  const t = getDictionary(locale).meta;
  return new ImageResponse(
    (
      <Frame>
        <div style={{ position: "absolute", left: 72, top: 176, width: 640, display: "flex", flexDirection: "column", gap: 28 }}>
          <span style={{ fontFamily: "Archivo Expanded", fontSize: 58, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.04 }}>
            {t.ogHeadline}
          </span>
          <span style={{ fontSize: 26, color: BODY, lineHeight: 1.35 }}>{t.ogSub}</span>
        </div>
      </Frame>
    ),
    { ...ogSize, fonts },
  );
}

interface TitleOg {
  readonly title: string;
  /** Short URL shown under the title, e.g. `meridui.dev/blog`. */
  readonly label: string;
}

/**
 * Per-page Open Graph image for blog posts and comparisons: the same sheet and logo,
 * the page title (up to four lines) and a URL label. No other text.
 * The Archivo instances cover Latin Extended, so Turkish titles (ş, ğ, ı, İ) render.
 */
export function renderTitleOgImage({ title, label }: TitleOg) {
  const fontSize = title.length > 64 ? 42 : title.length > 44 ? 48 : 56;
  return new ImageResponse(
    (
      <Frame>
        <div style={{ position: "absolute", left: 72, top: 150, width: 640, height: 330, display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: "Archivo Expanded", fontSize, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.08 }}>
            {title}
          </span>
        </div>
        <div style={{ position: "absolute", left: 72, top: 512, display: "flex", fontSize: 24, color: BODY }}>{label}</div>
      </Frame>
    ),
    { ...ogSize, fonts },
  );
}
