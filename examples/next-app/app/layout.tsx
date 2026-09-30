import type { Metadata, Viewport } from "next";
import "@meridui/react/styles.css";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: { default: "Northwind Cloud", template: "%s · Northwind Cloud" },
  description: "Deploy, observe and scale services on Northwind Cloud.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

// Applies a stored theme before first paint so there is no flash of the wrong theme.
const THEME_SCRIPT = `try{var t=localStorage.getItem("nw-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>{children}</main>
      </body>
    </html>
  );
}
