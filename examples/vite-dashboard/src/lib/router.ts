import { useEffect, useState } from "react";

export type Route = "overview" | "projects" | "settings";

const ROUTES: readonly Route[] = ["overview", "projects", "settings"];

function parseHash(hash: string): Route {
  const name = hash.replace(/^#\/?/, "").split(/[/?]/)[0];
  return (ROUTES as readonly string[]).includes(name) ? (name as Route) : "overview";
}

export function hrefFor(route: Route, query?: Record<string, string>): string {
  const search = query ? `?${new URLSearchParams(query).toString()}` : "";
  return `#/${route}${search}`;
}

/** Query parameters carried in the hash, e.g. `#/projects?q=api`. */
export function hashQuery(): URLSearchParams {
  const index = window.location.hash.indexOf("?");
  return new URLSearchParams(index === -1 ? "" : window.location.hash.slice(index + 1));
}

/** A tiny hash router: the URL hash is the single source of truth. Returns the route and the raw hash. */
export function useHashRoute(): { route: Route; hash: string } {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return { route: parseHash(hash), hash };
}
