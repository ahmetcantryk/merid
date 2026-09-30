"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Kbd,
  NativeSelect,
  Progress,
  SegmentedControl,
  Switch,
  Tabs,
} from "@meridui/react";
import { readTheme, type Theme } from "@/components/ThemeToggle";
import { useDictionary } from "@/lib/i18n/client";
import { ACCENTS, DENSITIES, type AccentId, type DensityId } from "./playground-presets";


const MEMBERS = [
  { name: "Ada Lovelace", role: "owner" },
  { name: "Grace Hopper", role: "admin" },
  { name: "Linus Pauling", role: "viewer" },
] as const;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

function stageMarkup(theme: Theme, accent: AccentId, density: DensityId): string {
  return `<div\n  data-theme="${theme}"\n  data-accent="${accent}"\n  data-density="${density}"\n>\n  …\n</div>`;
}

export function Playground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useDictionary().playground;
  const themeOptions = [
    { value: "light", label: t.themeLight },
    { value: "dark", label: t.themeDark },
  ];
  // Themes only the stage (nested data-theme); starts from the site theme.
  const [theme, setTheme] = useState<Theme>("light");
  const [accent, setAccent] = useState<AccentId>("blue");
  const [density, setDensity] = useState<DensityId>("default");
  const visible = useRef(false);
  const themeRef = useRef<Theme>("light");

  useEffect(() => {
    const initial = readTheme();
    themeRef.current = initial;
    setTheme(initial);
  }, []);

  const changeTheme = useCallback((next: Theme) => {
    themeRef.current = next;
    setTheme(next);
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
      const byKey = ACCENTS.find((a) => a.key === key);
      if (byKey) setAccent(byKey.id);
      else if (key === "t") changeTheme(themeRef.current === "dark" ? "light" : "dark");
      else if (key === "d") {
        setDensity((current) => {
          const index = DENSITIES.findIndex((d) => d.id === current);
          return DENSITIES[(index + 1) % DENSITIES.length]?.id ?? "default";
        });
      } else return;
      event.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [changeTheme]);

  return (
    <div ref={rootRef} className="pg">
      <div className="pg__toolbar" role="group" aria-label={t.settings}>
        <div className="pg__control">
          <span className="pg__label">
            {t.theme} <Kbd size="sm">T</Kbd>
          </span>
          <SegmentedControl
            aria-label={t.theme}
            options={themeOptions}
            value={theme}
            onValueChange={(v) => changeTheme(v === "dark" ? "dark" : "light")}
          />
        </div>
        <div className="pg__control">
          <span className="pg__label" id="pg-accent-label">
            {t.accent} <Kbd size="sm">1</Kbd>–<Kbd size="sm">4</Kbd>
          </span>
          <div className="pg__swatches" role="radiogroup" aria-labelledby="pg-accent-label">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                role="radio"
                aria-checked={accent === a.id}
                aria-label={t.accents[a.id]}
                title={t.accents[a.id]}
                className="pg__swatch"
                data-accent={a.id}
                onClick={() => setAccent(a.id)}
              />
            ))}
          </div>
        </div>
        <div className="pg__control">
          <span className="pg__label">
            {t.density} <Kbd size="sm">D</Kbd>
          </span>
          <SegmentedControl
            aria-label={t.density}
            options={DENSITIES.map((d) => ({ value: d.id, label: t.densities[d.id] }))}
            value={density}
            onValueChange={(v) => setDensity(DENSITIES.find((d) => d.id === v)?.id ?? "default")}
          />
        </div>
      </div>

      <div className="pg__body">
        <div className="pg__stage" data-theme={theme} data-accent={accent} data-density={density}>
          <Card variant="elevated" padding="none" className="pg__card">
            <div className="pg__card-head">
              <div>
                <p className="pg__card-title">northwind-web</p>
                <p className="pg__card-meta">{t.projectMeta}</p>
              </div>
              <Badge tone="success" dot>
                {t.healthy}
              </Badge>
            </div>
            <Tabs.Root defaultValue="general">
              <Tabs.List aria-label={t.projectTabs} className="pg__tabs">
                <Tabs.Trigger value="general">{t.tabGeneral}</Tabs.Trigger>
                <Tabs.Trigger value="members">{t.tabMembers}</Tabs.Trigger>
                <Tabs.Trigger value="usage">{t.tabUsage}</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Panel value="general" className="pg__panel">
                <div className="pg__fields">
                  <Field label={t.projectName}>
                    <Input defaultValue="northwind-web" />
                  </Field>
                  <Field label={t.region}>
                    <NativeSelect defaultValue="eu">
                      <option value="eu">Frankfurt, eu-central</option>
                      <option value="us">Virginia, us-east</option>
                      <option value="ap">Tokyo, ap-northeast</option>
                    </NativeSelect>
                  </Field>
                </div>
                <Switch defaultChecked>{t.deployOnPush}</Switch>
                <Checkbox>{t.requireReview}</Checkbox>
              </Tabs.Panel>
              <Tabs.Panel value="members" className="pg__panel">
                <ul className="pg__members">
                  {MEMBERS.map((m) => (
                    <li key={m.name}>
                      <Avatar name={m.name} size="sm" />
                      <span className="pg__member-name">{m.name}</span>
                      <Badge tone={m.role === "owner" ? "accent" : "neutral"}>{t.roles[m.role]}</Badge>
                    </li>
                  ))}
                </ul>
              </Tabs.Panel>
              <Tabs.Panel value="usage" className="pg__panel">
                <Progress aria-label={t.buildMinutes} value={64} />
                <p className="pg__card-meta">{t.usage}</p>
              </Tabs.Panel>
            </Tabs.Root>
            <div className="pg__card-foot">
              <Button variant="ghost">{t.cancel}</Button>
              <Button variant="primary">{t.save}</Button>
            </div>
          </Card>
        </div>
        <div className="pg__tokens">
          <p className="pg__tokens-title">stage.html</p>
          <pre aria-live="polite">
            <code>{stageMarkup(theme, accent, density)}</code>
          </pre>
          <p className="pg__tokens-note">
            {t.tokensNote}
          </p>
        </div>
      </div>
    </div>
  );
}
