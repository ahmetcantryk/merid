"use client";

import { type ReactNode, useSyncExternalStore } from "react";
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

export interface PortalProps {
  /** Content rendered into the portal. */
  children: ReactNode;
  /**
   * Target element. `undefined` (default) renders into `document.body`; `null` means the target
   * is not ready yet (e.g. a ref not attached) and renders nothing.
   */
  container?: Element | null;
}

/** Renders children into `document.body` (or `container`). Renders nothing during SSR, hydration or while `container` is `null`. */
export function Portal({ children, container }: PortalProps) {
  const isClient = useIsClient();
  if (!isClient || container === null) return null;
  return createPortal(children, container ?? document.body);
}
