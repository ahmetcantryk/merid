"use client";

import { type ReactNode, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => undefined;

/** True on the client after hydration, false on the server and during hydration. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/** Subtree attributes a portalled overlay inherits from where it was opened. */
export const SCOPE_ATTRIBUTES = ["data-theme", "data-accent", "data-density", "dir"] as const;

type Scope = Partial<Record<(typeof SCOPE_ATTRIBUTES)[number], string>>;

/**
 * Nearest-ancestor values of the subtree attributes for `element`. Values set on `<html>` / `<body>`
 * are skipped: a portal in `<body>` already inherits them (and stays live when they change).
 */
export function readScope(element: Element | null | undefined): Scope {
  const scope: Scope = {};
  if (!element) return scope;
  const doc = element.ownerDocument;
  for (const name of SCOPE_ATTRIBUTES) {
    const owner = element.closest(`[${name}]`);
    if (!owner || owner === doc.documentElement || owner === doc.body) continue;
    const value = owner.getAttribute(name);
    if (value) scope[name] = value;
  }
  return scope;
}

const sameScope = (a: Scope, b: Scope) =>
  SCOPE_ATTRIBUTES.every((name) => a[name] === b[name]);

export interface PortalProps {
  /** Content rendered into the portal. */
  children: ReactNode;
  /**
   * Target element. `undefined` (default) renders into `document.body`; `null` means the target
   * is not ready yet (e.g. a ref not attached) and renders nothing.
   */
  container?: Element | null;
}

interface InternalPortalProps extends PortalProps {
  /**
   * Element whose subtree attributes (`data-theme`, `data-accent`, `data-density`, `dir`) the portalled
   * content inherits. When given, content is wrapped in a `display: contents` `.mrd-portal` element carrying them.
   */
  scopeFrom?: () => Element | null | undefined;
}

/** Renders children into `document.body` (or `container`). Renders nothing during SSR, hydration or while `container` is `null`. */
export function Portal({ children, container, scopeFrom }: InternalPortalProps) {
  const isClient = useIsClient();
  const [scope, setScope] = useState<Scope>({});
  // Overlays pass an inline scopeFrom, so this re-reads on each of their renders (cheap) and follows
  // the anchor if its subtree attributes change.
  useLayoutEffect(() => {
    if (!scopeFrom) return;
    const next = readScope(scopeFrom());
    setScope((prev) => (sameScope(prev, next) ? prev : next));
  }, [scopeFrom]);
  if (!isClient || container === null) return null;
  const content = scopeFrom ? (
    <div className="mrd-portal" style={{ display: "contents" }} {...scope}>
      {children}
    </div>
  ) : (
    children
  );
  return createPortal(content, container ?? document.body);
}
