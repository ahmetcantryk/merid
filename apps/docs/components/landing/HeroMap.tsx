import { contourSheet } from "@/lib/contours";

const WIDTH = 480;
const HEIGHT = 460;

/**
 * The hero's map sheet: elevation contours inside a ticked neat line, crossed by one meridian
 * in the accent. No labels. Rendered on the server; the paths are computed once per build.
 */
export function HeroMap() {
  const sheet = contourSheet(WIDTH, HEIGHT);
  return (
    <div className="hero-map" aria-hidden="true">
      <div className="hero-map__sheet">
        <svg
          className="hero-map__contours"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          {sheet.paths.map((d, level) => (
            <path key={level} d={d} data-index={sheet.isIndex(level) || undefined} />
          ))}
        </svg>
      </div>
      <span className="hero-map__meridian" />
    </div>
  );
}
