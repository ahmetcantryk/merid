/**
 * The Pafta contour map: a made-up terrain drawn as elevation contours (marching squares),
 * shared by the landing hero and the Open Graph images. Pure maths, no randomness, so the same
 * sheet renders on the server, in the browser and in every OG image.
 */

export interface ContourSheet {
  readonly width: number;
  readonly height: number;
  /** One SVG path per contour level, lowest first. */
  readonly paths: readonly string[];
  /** Every fifth level is an index contour, drawn heavier like on a printed map. */
  readonly isIndex: (level: number) => boolean;
}

type Point = readonly [number, number];

/** Three hills and a saddle, with a slow ripple so the lines never look machine-perfect. */
function elevation(x: number, y: number, w: number, h: number): number {
  const u = x / w;
  const v = y / h;
  const hill = (cu: number, cv: number, su: number, sv: number, peak: number) =>
    peak * Math.exp(-(((u - cu) / su) ** 2 + ((v - cv) / sv) ** 2));
  const ripple = 0.03 * Math.sin(u * 9.1 + v * 5.3) + 0.022 * Math.sin(u * 15.7 - v * 8.9) + 0.018 * Math.cos(v * 13.1);
  return (
    hill(0.32, 0.42, 0.26, 0.24, 1) +
    hill(0.7, 0.24, 0.17, 0.16, 0.62) +
    hill(0.78, 0.74, 0.24, 0.15, 0.4) +
    hill(0.12, 0.9, 0.2, 0.12, 0.22) +
    ripple
  );
}

const lerp = (a: number, b: number, level: number) => (level - a) / (b - a);

/** Marching squares for one level, with the segments chained into polylines. */
function trace(grid: Float64Array, nx: number, ny: number, step: number, level: number): Point[][] {
  const at = (i: number, j: number) => grid[j * nx + i] ?? 0;
  // Each crossing is keyed by the grid edge it sits on, so neighbouring cells share endpoints.
  const points = new Map<string, Point>();
  const links = new Map<string, string[]>();
  const crossing = (key: string, p: Point) => {
    if (!points.has(key)) points.set(key, p);
    return key;
  };
  const link = (a: string, b: string) => {
    links.set(a, [...(links.get(a) ?? []), b]);
    links.set(b, [...(links.get(b) ?? []), a]);
  };

  for (let j = 0; j < ny - 1; j += 1) {
    for (let i = 0; i < nx - 1; i += 1) {
      const tl = at(i, j);
      const tr = at(i + 1, j);
      const br = at(i + 1, j + 1);
      const bl = at(i, j + 1);
      const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * step;
      const y = j * step;
      const T = () => crossing(`h${i},${j}`, [x + step * lerp(tl, tr, level), y]);
      const B = () => crossing(`h${i},${j + 1}`, [x + step * lerp(bl, br, level), y + step]);
      const L = () => crossing(`v${i},${j}`, [x, y + step * lerp(tl, bl, level)]);
      const R = () => crossing(`v${i + 1},${j}`, [x + step, y + step * lerp(tr, br, level)]);
      const centreHigh = (tl + tr + br + bl) / 4 > level;
      switch (idx) {
        case 1: case 14: link(L(), B()); break;
        case 2: case 13: link(B(), R()); break;
        case 3: case 12: link(L(), R()); break;
        case 4: case 11: link(T(), R()); break;
        case 6: case 9: link(T(), B()); break;
        case 7: case 8: link(L(), T()); break;
        case 5:
          if (centreHigh) { link(L(), B()); link(T(), R()); } else { link(L(), T()); link(B(), R()); }
          break;
        case 10:
          if (centreHigh) { link(L(), T()); link(B(), R()); } else { link(T(), R()); link(L(), B()); }
          break;
      }
    }
  }

  const seen = new Set<string>();
  const walk = (start: string): Point[] => {
    const line: Point[] = [];
    let current: string | undefined = start;
    let previous: string | undefined;
    while (current && !seen.has(current)) {
      seen.add(current);
      const p = points.get(current);
      if (p) line.push(p);
      const nextKey: string | undefined = (links.get(current) ?? []).find((k) => k !== previous && !seen.has(k));
      previous = current;
      current = nextKey;
    }
    // Close loops: the walk stops one short of the start.
    const first = points.get(start);
    if (first && (links.get(start) ?? []).length === 2 && line.length > 2) line.push(first);
    return line;
  };

  const lines: Point[][] = [];
  // Open lines first (they start on the sheet edge, where a key has one link), then closed loops.
  for (const [key, next] of links) if (next.length === 1 && !seen.has(key)) lines.push(walk(key));
  for (const key of links.keys()) if (!seen.has(key)) lines.push(walk(key));
  return lines.filter((l) => l.length > 2);
}

const fmt = (n: number) => String(Math.round(n * 10) / 10);

/** Absolute start point, then relative steps: short paths for large sheets. */
function toPath(lines: readonly Point[][]): string {
  return lines
    .map((line) => {
      const [first, ...rest] = line;
      if (!first) return "";
      let [px, py] = first;
      let d = `M${fmt(px)} ${fmt(py)}l`;
      for (const [x, y] of rest) {
        const dx = Math.round((x - px) * 10) / 10;
        const dy = Math.round((y - py) * 10) / 10;
        px += dx;
        py += dy;
        d += `${fmt(dx)} ${fmt(dy)} `;
      }
      return d.trimEnd();
    })
    .join("");
}

const cache = new Map<string, ContourSheet>();

/** Contours for a `width` × `height` sheet (in SVG units), one level every `interval` of elevation. */
export function contourSheet(width: number, height: number, step = 5, interval = 0.05): ContourSheet {
  const key = `${width}x${height}@${step}/${interval}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const nx = Math.ceil(width / step) + 1;
  const ny = Math.ceil(height / step) + 1;
  const grid = new Float64Array(nx * ny);
  for (let j = 0; j < ny; j += 1) {
    for (let i = 0; i < nx; i += 1) grid[j * nx + i] = elevation(i * step, j * step, width, height);
  }
  const levels = Array.from({ length: 21 }, (_, k) => 0.04 + k * interval);
  const sheet: ContourSheet = {
    width,
    height,
    paths: levels.map((level) => toPath(trace(grid, nx, ny, step, level))),
    isIndex: (level) => level % 5 === 0,
  };
  cache.set(key, sheet);
  return sheet;
}
