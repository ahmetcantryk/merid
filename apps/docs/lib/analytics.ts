/**
 * Typed wrapper around Umami's `window.umami.track`. Every event and its data shape is declared
 * here, so a call site cannot send an unknown event or a misspelled field. When Umami is not
 * loaded (no env, ad blocker, dev) calls are no-ops; analytics must never break the UI.
 */
export interface AnalyticsEvents {
  /** npm/pnpm/yarn install command copied. */
  readonly copy_install: { readonly command: string; readonly location: "hero" | "docs" | "blog" | "compare"; readonly path: string };
  /** A link to the GitHub repository clicked. */
  readonly github_click: { readonly location: "header" | "footer" | "hero" | "blog-cta" };
  /** Language switcher used. */
  readonly locale_switch: { readonly from: string; readonly to: string; readonly path: string };
  /** Landing token studio control changed. */
  readonly playground_change: { readonly control: string; readonly value: string; readonly input: "pointer" | "keyboard" };
  /** Call to action at the end of a blog post or compare page. */
  readonly blog_cta_click: { readonly target: "docs" | "github"; readonly path: string };
}

export type EventName = keyof AnalyticsEvents;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, string | number>) => void };
  }
}

export function track<E extends EventName>(name: E, data: AnalyticsEvents[E]): void {
  try {
    window.umami?.track(name, { ...data });
  } catch (error) {
    // Never let analytics break an interaction; keep a trace for debugging.
    console.warn("[analytics] track failed", name, error);
  }
}

/** Install commands worth a `copy_install` event: npm i / npm install / pnpm add / yarn add / bun add. */
export function isInstallCommand(value: string): boolean {
  return /^\s*(npm (i|install)|pnpm add|yarn add|bun add)\s+\S/.test(value);
}

/** `data-umami-event` attributes for plain links: tracked without client JS. */
export function trackAttrs<E extends EventName>(name: E, data: AnalyticsEvents[E]): Record<string, string> {
  const attrs: Record<string, string> = { "data-umami-event": name };
  for (const [key, value] of Object.entries(data)) attrs[`data-umami-event-${key}`] = String(value);
  return attrs;
}
