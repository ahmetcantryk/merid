import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.25" stroke="#0f1219" strokeWidth="1.25" />
          <path d="M12 1.5C15.6 5 17 8.4 17 12s-1.4 7-5 10.5" stroke="#3f63f5" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
