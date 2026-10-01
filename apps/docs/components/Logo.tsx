import { lockup, wave, waveShadows, waveViewBox, wordmark } from "@/lib/brand-paths";

interface LogoMarkProps {
  readonly height?: number;
  readonly title?: string;
}

const [, , VB_W = 1, VB_H = 1] = waveViewBox.split(" ").map(Number);

function WaveBody() {
  return (
    <>
      <path fill="var(--logo-wave)" d={wave} />
      {waveShadows.map((d) => (
        <path key={d.slice(0, 24)} fill="var(--logo-shadow)" d={d} />
      ))}
    </>
  );
}

/**
 * The Merid mark: a wave whose two crests form an M, a signal riding the meridian.
 * The wave takes the accent; the shadows where the line passes under itself are ink (light) or deep magenta (dark).
 */
export function LogoMark({ height = 12, title }: LogoMarkProps) {
  const width = Math.round((height * VB_W) / VB_H);
  return (
    <svg
      width={width}
      height={height}
      viewBox={waveViewBox}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className="logo-mark"
    >
      <WaveBody />
    </svg>
  );
}

/** Mark + outlined wordmark as one drawing, so the wave sits on the wordmark's x-height at every size. */
export function Logo({ height = 15 }: { readonly height?: number }) {
  const width = Math.round((height * lockup.width) / lockup.height);
  return (
    <svg width={width} height={height} viewBox={lockup.viewBox} role="img" aria-label="Merid" className="logo">
      <g transform={lockup.markTransform}>
        <WaveBody />
      </g>
      <path fill="currentColor" transform={lockup.wordTransform} d={wordmark} />
    </svg>
  );
}
