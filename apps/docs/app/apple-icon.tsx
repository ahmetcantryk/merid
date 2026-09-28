import { ImageResponse } from "next/og";
import { icon, wave, waveShadows } from "@/lib/brand-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same drawing as app/icon.svg (white wave on the accent tile), full-bleed because iOS applies its own mask. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: icon.tile }}>
        <svg width="180" height="180" viewBox="0 0 512 512">
          <g transform={icon.transform}>
            <path fill={icon.wave} d={wave} />
            {waveShadows.map((d) => (
              <path key={d.slice(0, 24)} fill={icon.shadow} d={d} />
            ))}
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
