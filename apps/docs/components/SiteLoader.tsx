import { waveMono, waveViewBox } from "@/lib/brand-paths";

interface SiteLoaderProps {
  /** Accessible name, read once by screen readers. */
  label: string;
  /** Inline size for small waits (search); the default fills the content area. */
  compact?: boolean;
  /** Unique per page when more than one loader can be on screen. */
  id?: string;
}

/**
 * Loading state: the wave mark fills with the accent from the left and drains to the
 * right, forever. Pure SVG and CSS; it appears after a short delay so fast loads never
 * flash it, and it stands still when reduced motion is requested.
 */
export function SiteLoader({ label, compact = false, id = "site-loader" }: SiteLoaderProps) {
  const clip = `${id}-clip`;
  return (
    <div className={compact ? "site-loader site-loader--compact" : "site-loader"} role="status" aria-label={label}>
      <svg className="site-loader__mark" viewBox={waveViewBox} aria-hidden="true">
        <defs>
          <clipPath id={clip}>
            <path d={waveMono} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clip})`}>
          <rect className="site-loader__track" x="-24" y="622" width="2096" height="804" />
          <rect className="site-loader__level" x="-24" y="622" width="2096" height="804" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Shows the full-screen splash once per browser session: the first page load plays one
 * fill-and-drain cycle, later navigations skip it. Automated browsers (tests, crawlers that
 * set navigator.webdriver) never see it. Runs before paint.
 */
export const splashInitScript = `try{if(navigator.webdriver||sessionStorage.getItem("mrd-splash"))document.documentElement.classList.add("no-splash");else sessionStorage.setItem("mrd-splash","1")}catch(e){document.documentElement.classList.add("no-splash")}`;
