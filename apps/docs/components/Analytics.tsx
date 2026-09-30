import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Cookie-less analytics. Umami loads only when both env vars are set, and only counts visits on
 * the production host (`data-domains`), so previews and local builds collect nothing.
 * Speed Insights only renders on Vercel builds, where its script endpoint exists.
 */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umami = Boolean(src && websiteId);
  return (
    <>
      {umami ? (
        <Script
          src={src}
          data-website-id={websiteId}
          data-domains="meridui.dev"
          data-do-not-track="true"
          strategy="afterInteractive"
        />
      ) : null}
      {process.env.VERCEL ? <SpeedInsights /> : null}
    </>
  );
}
