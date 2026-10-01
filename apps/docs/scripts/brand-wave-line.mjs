// The wave line: the Merid mark redrawn as a single hairline, for the landing page's section rules.
//
// The mark is a filled ribbon. Slicing its silhouette vertically and taking the middle of each slice
// traces the ribbon's centreline; its crests and troughs are evenly spaced, so the line is the sine
// through them. What comes from the mark: how many half-waves there are, which way the line sets off,
// and that they are even. What comes from the layout: the box each line is drawn into.

const CURVE_STEPS = 32;
const SAMPLES = 1024;
/** Crests and troughs may drift this far (as a share of the mean spacing) before the sine stops being a fair reading. */
const SPACING_TOLERANCE = 0.05;

/** Flattens an absolute M/L/C/Z path into closed polygons. */
function flatten(d) {
  const tokens = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  const polygons = [];
  let polygon = [];
  let cursor = [0, 0];
  let start = cursor;
  let command = "";
  let i = 0;
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[a-z]/i.test(tokens[i])) command = tokens[i++].toUpperCase();
    if (command === "M") {
      if (polygon.length) polygons.push(polygon);
      cursor = [num(), num()];
      start = cursor;
      polygon = [cursor];
      command = "L";
    } else if (command === "L") {
      cursor = [num(), num()];
      polygon.push(cursor);
    } else if (command === "C") {
      const [p0, p1, p2, p3] = [cursor, [num(), num()], [num(), num()], [num(), num()]];
      for (let s = 1; s <= CURVE_STEPS; s++) {
        const t = s / CURVE_STEPS;
        const u = 1 - t;
        const at = (k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k];
        polygon.push([at(0), at(1)]);
      }
      cursor = p3;
    } else if (command === "Z") {
      polygon.push(start);
      polygons.push(polygon);
      polygon = [];
      cursor = start;
    } else {
      throw new Error(`brand-wave-line: unsupported path command "${command}"`);
    }
  }
  if (polygon.length) polygons.push(polygon);
  return polygons;
}

/** Middle of the silhouette's vertical extent at x. */
function sliceMiddle(polygons, x) {
  let top = Infinity;
  let bottom = -Infinity;
  for (const polygon of polygons) {
    for (let k = 0; k < polygon.length - 1; k++) {
      const [a, b] = [polygon[k], polygon[k + 1]];
      if (a[0] === b[0] || (a[0] - x) * (b[0] - x) > 0) continue;
      const y = a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  return (top + bottom) / 2;
}

/** Reads the mark's centreline: its crests and troughs, and the sine they describe. */
export function measureWave(silhouette) {
  const polygons = flatten(silhouette);
  const xs = polygons.flat().map((p) => p[0]);
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const step = (maxX - minX) / SAMPLES;
  const line = Array.from({ length: SAMPLES - 1 }, (_, i) => {
    const x = minX + step * (i + 1);
    return [x, sliceMiddle(polygons, x)];
  });
  const extremes = line.filter(([, y], i) => {
    const prev = line[i - 1]?.[1];
    const next = line[i + 1]?.[1];
    return prev !== undefined && next !== undefined && (y - prev) * (next - y) < 0;
  });
  if (extremes.length < 2) throw new Error("brand-wave-line: the mark's centreline has no crests to follow");

  const gaps = extremes.slice(1).map(([x], i) => x - extremes[i][0]);
  const halfWave = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  if (gaps.some((g) => Math.abs(g - halfWave) > halfWave * SPACING_TOLERANCE)) {
    throw new Error(`brand-wave-line: crests are unevenly spaced (${gaps.map((g) => g.toFixed(0)).join(", ")})`);
  }
  const ys = extremes.map(([, y]) => y);
  const centre = (Math.min(...ys) + Math.max(...ys)) / 2;
  const amplitude = (Math.max(...ys) - Math.min(...ys)) / 2;
  return {
    halfWaves: extremes.length,
    /** SVG y grows downwards: the mark dips into a trough before its first crest. */
    startsDown: extremes[0][1] > centre,
    /** Crest height over wavelength, for reference when choosing a box. */
    ratio: amplitude / (halfWave * 2),
  };
}

/**
 * One wave line as an SVG for a CSS mask: the measured sine from midline to midline across `width`,
 * centred in a box `height` tall, sampled every half pixel.
 */
export function waveLineSvg(wave, { width, height, amplitude, stroke }) {
  const direction = wave.startsDown ? 1 : -1;
  const wavelength = (width * 2) / wave.halfWaves;
  const centre = height / 2;
  const points = Array.from({ length: width * 2 + 1 }, (_, i) => {
    const x = i / 2;
    const y = centre + direction * amplitude * Math.sin((2 * Math.PI * x) / wavelength);
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  const d = `M${points.join(" L")}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${d}" fill="none" stroke="#000" stroke-width="${stroke}" stroke-linejoin="round" stroke-linecap="butt"/></svg>\n`;
}
