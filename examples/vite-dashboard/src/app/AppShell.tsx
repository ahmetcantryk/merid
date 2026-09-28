import { useEffect, useRef, type ReactNode } from "react";
import { Text } from "@merid/react";
import type { Route } from "../lib/router";
import { AppHeader } from "./AppHeader";
import { AppNav } from "./nav";

const TITLES: Record<Route, string> = { overview: "Overview", projects: "Projects", settings: "Settings" };

export function AppShell({ route, children }: { route: Route; children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // After client-side navigation, move focus to the page so keyboard users land on the new content.
  useEffect(() => {
    document.title = `${TITLES[route]} · Northwind Cloud`;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [route]);

  return (
    <div className="shell">
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>
        Skip to content
      </a>
      <aside className="shell__sidebar">
        <Brand />
        <AppNav route={route} />
      </aside>
      <div className="shell__body">
        <AppHeader route={route} />
        <main id="main" ref={mainRef} tabIndex={-1} className="shell__main">
          {children}
        </main>
      </div>
    </div>
  );
}

export function Brand() {
  return (
    <div className="brand">
      <span className="brand__mark" aria-hidden="true">N</span>
      <Text as="span" weight="semibold" tone="ink">Northwind Cloud</Text>
    </div>
  );
}
