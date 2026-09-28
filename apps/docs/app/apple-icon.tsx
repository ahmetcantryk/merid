import { ImageResponse } from "next/og";
import { iconAccent, iconInk, iconStroke } from "@/lib/brand-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same drawing as app/icon.svg (white M on the accent tile), full-bleed because iOS applies its own mask. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#3f63f5" }}>
        <svg width="180" height="180" viewBox="3 3 26 26">
          <g fill="#ffffff" stroke="#ffffff" strokeWidth={iconStroke * 0.8} strokeLinejoin="round">
            <path d={iconInk} />
            <path d={iconAccent} />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
