import { renderOgImage } from "@/lib/og";

export const alt = "Merid: Ayrıntısı düşünülmüş React bileşenleri.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage("tr");
}
