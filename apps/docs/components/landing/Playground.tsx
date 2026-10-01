"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { track } from "@/lib/analytics";
import { useDictionary } from "@/lib/i18n/client";
import { INITIAL_APP, StudioApp, type AppState } from "./studio/StudioApp";
import { StudioControls, type ControlName } from "./studio/StudioControls";
import { StudioDiff } from "./studio/StudioDiff";
import {
  ACCENTS,
  DEFAULT_TOKENS,
  DENSITIES,
  RADII,
  THEMES,
  stageStyle,
  type StudioTokens,
} from "./studio/tokens";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

function next<T>(list: readonly T[], current: T): T {
  return list[(list.indexOf(current) + 1) % list.length] ?? current;
}

function attributesFor(t: StudioTokens): string {
  const theme = t.theme === "split" ? "light | dark" : t.theme;
  return `data-theme="${theme}" data-accent="${t.accent}" data-density="${t.density}"`;
}

const SAME = (a: StudioTokens, b: StudioTokens) =>
  a.theme === b.theme && a.accent === b.accent && a.density === b.density && a.radius === b.radius && a.scale === b.scale;

/**
 * Landing token studio: a token editor on the left, a full app screen built from the library on
 * the right, and the CSS the settings amount to underneath. Theme, accent and density are the
 * library's subtree attributes; radius and type scale are custom-property overrides on the stage.
 * Split mode renders the screen twice (light, and an inert dark copy) divided by a 1px meridian.
 */
export function Playground() {
  const t = useDictionary().playground;
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const [tokens, setTokens] = useState<StudioTokens>(DEFAULT_TOKENS);
  const [app, setApp] = useState<AppState>(INITIAL_APP);
  const [split, setSplit] = useState(50);
  const tokensRef = useRef(tokens);
  tokensRef.current = tokens;

  const change = useCallback((control: ControlName, value: string, input: "pointer" | "keyboard" = "pointer") => {
    setTokens((current) => ({ ...current, [control]: value }) as StudioTokens);
    track("playground_change", { control, value, input });
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry?.isIntersecting ?? false;
    });
    observer.observe(node);

    function onKey(event: KeyboardEvent) {
      if (!visible.current || event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      const key = event.key.toLowerCase();
      const accent = ACCENTS.find((a) => a.key === key);
      const current = tokensRef.current;
      let control: ControlName | undefined;
      let value: string | undefined;
      if (accent) [control, value] = ["accent", accent.id];
      else if (key === "t") [control, value] = ["theme", next(THEMES, current.theme)];
      else if (key === "d") [control, value] = ["density", next(DENSITIES, current.density)];
      else if (key === "r") [control, value] = ["radius", next(RADII, current.radius)];
      if (!control || value === undefined) return;
      event.preventDefault();
      change(control, value, "keyboard");
    }
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [change]);

  const dragMeridian = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    event.preventDefault();
    const rect = viewport.getBoundingClientRect();
    const move = (e: PointerEvent) => setSplit(Math.round(Math.min(95, Math.max(5, ((e.clientX - rect.left) / rect.width) * 100))));
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  }, []);

  const isSplit = tokens.theme === "split";
  const stage = stageStyle(tokens) as CSSProperties;
  const layer = (theme: "light" | "dark", mirror: boolean) => (
    <div
      className="pg__stage studio-layer"
      data-layer={mirror ? "mirror" : "main"}
      data-theme={theme}
      data-accent={tokens.accent}
      data-density={tokens.density}
      style={stage}
    >
      <StudioApp t={t} state={app} onChange={setApp} mirror={mirror} />
    </div>
  );

  return (
    <div ref={rootRef} className="pg studio">
      <StudioControls
        t={t}
        tokens={tokens}
        onChange={(control, value) => change(control, value)}
        onReset={() => setTokens(DEFAULT_TOKENS)}
        canReset={!SAME(tokens, DEFAULT_TOKENS)}
      />

      <div className="studio-window">
        <div className="studio-window__bar">
          {isSplit ? (
            <label className="studio-window__split">
              <span aria-hidden="true">{t.splitPosition}</span>
              <input
                type="range"
                min={5}
                max={95}
                value={split}
                onChange={(e) => setSplit(Number(e.target.value))}
                aria-label={t.splitPosition}
                aria-valuetext={`${t.splitLight} ${split}%, ${t.splitDark} ${100 - split}%`}
              />
            </label>
          ) : (
            <code className="studio-window__attrs">{attributesFor(tokens)}</code>
          )}
        </div>
        <div
          ref={viewportRef}
          className="studio-window__viewport"
          data-split={isSplit || undefined}
          style={{ "--split": `${split}%` } as CSSProperties}
          role="region"
          aria-label={t.previewLabel}
        >
          {layer(tokens.theme === "dark" ? "dark" : "light", false)}
          {isSplit ? (
            <>
              {layer("dark", true)}
              <div className="studio-meridian" aria-hidden="true">
                <div className="studio-meridian__grip" onPointerDown={dragMeridian} />
                <span className="studio-meridian__tag" data-side="light">{t.splitLight}</span>
                <span className="studio-meridian__tag" data-side="dark">{t.splitDark}</span>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <StudioDiff t={t} tokens={tokens} attrs={attributesFor(tokens)} />
    </div>
  );
}
