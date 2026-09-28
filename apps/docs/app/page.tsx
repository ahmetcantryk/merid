import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { CopyButton } from "@/components/CopyButton";
import { site } from "@/lib/site";
import { FoundationIndex } from "./_landing/FoundationIndex";
import { Workspace } from "./_landing/Workspace";

const SHOWCASE_CODE = `import {
  Button, Card, Field,
  Input, Stack, Switch,
} from "@merid/react";

export function Workspace() {
  return (
    <Card variant="elevated">
      <Stack gap={5} align="start">
        <Field label="Workspace name">
          <Input defaultValue="Northwind" />
        </Field>
        <Switch defaultChecked>Weekly digest</Switch>
        <Button variant="primary">Save changes</Button>
      </Stack>
    </Card>
  );
}`;

const PRINCIPLES = [
  { title: "One accent, used sparingly", text: "A single cool blue carries interaction and selection. Everything else is ink-tinted neutral." },
  { title: "Surface before border", text: "Grey trays separate regions first. A 1px hairline is the last resort, never a heavier rule." },
  { title: "Faint, tinted shadows", text: "Long, soft shadows tinted with ink rather than black. Elevation reads as distance, not weight." },
  { title: "Hierarchy from tone", text: "Three text tones and two weights. Headings are tight, body is relaxed, colour is never a crutch." },
  { title: "Quiet interaction", text: "Tints, 3px lifts and a .97 press in 150–200ms. Reduced motion removes all of it." },
  { title: "Plain CSS, open cascade", text: "Every rule lives in a named cascade layer, so your styles win without !important." },
] as const;

const RELEASE_NOTES = [
  ["Foundations", "Colour, type, spacing, radius, elevation and motion tokens with light and dark values."],
  ["Components", "46 accessible components, from layout primitives to Select, Tabs, Table and Toast."],
  ["Overlays", "Dialog, Drawer, AlertDialog, Popover and DropdownMenu with asChild triggers, sizes and focus management."],
  ["Accessibility", "AA-contrast tokens, including --mrd-accent-solid for filled accents, and WAI-ARIA keyboard patterns."],
  ["Styling", "One stylesheet, three cascade layers, no runtime CSS-in-JS and no build plugin."],
  ["Documentation", "This site: foundations, accessibility statement, versioning policy and search."],
] as const;

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <Link href="/docs/changelog" className="hero__version">
            <span className="hero__version-tag">v{site.version}</span>
            First public release
          </Link>
          <h1>Quiet, precise components for React.</h1>
          <p className="hero__lead">
            Merid is an accessible component library written in plain CSS and a small set of design tokens. Hairline
            borders, one cool accent, soft grey trays and calm motion — so your product reads as considered, not decorated.
          </p>
          <div className="hero__actions">
            <Link href="/docs/introduction" className="btn" data-variant="primary" data-size="lg">
              Get started
            </Link>
            <Link href="/docs/components" className="btn" data-variant="secondary" data-size="lg">
              Browse components
            </Link>
            <div className="install" aria-label="Install command">
              <span className="install__prompt" aria-hidden="true">$</span>
              <code>{site.install}</code>
              <CopyButton value={site.install} />
            </div>
          </div>

          <div className="meridian" aria-hidden="true" />

          <div className="showcase">
            <div className="window">
              <div className="window__bar">
                <span className="window__dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                Workspace.tsx
              </div>
              <CodeBlock code={SHOWCASE_CODE} lang="tsx" />
            </div>
            <div className="window">
              <div className="window__bar">Preview</div>
              <div className="showcase__stage">
                <Workspace />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="principles-title">
        <div className="container">
          <div className="section-head">
            <h2 id="principles-title">A small set of rules, applied everywhere.</h2>
            <p>
              Every component follows the same contract, so a page built from Merid holds together without a design
              review. <Link href="/docs/foundations/principles">Read the principles</Link>
            </p>
          </div>
          <div className="principles">
            {PRINCIPLES.map((p, i) => (
              <article key={p.title} className="principle">
                <span className="principle__index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-surface="tray" aria-labelledby="foundations-title">
        <div className="container">
          <div className="section-head">
            <h2 id="foundations-title">Foundations</h2>
            <p>
              The tokens behind every component, documented with their light and dark values and the reason each one
              exists.
            </p>
          </div>
          <FoundationIndex />
        </div>
      </section>

      <section className="section" aria-labelledby="release-title">
        <div className="container">
          <div className="release">
            <div className="release__meta">
              <h2 id="release-title" className="release__label">What’s new</h2>
              <strong>Version {site.version}</strong>
              <time dateTime={site.releaseDate}>28 September 2026</time>
            </div>
            <div>
              <ul className="release__list">
                {RELEASE_NOTES.map(([area, note]) => (
                  <li key={area}>
                    <span>{area}</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
              <p className="release__more">
                <Link href="/docs/changelog">Full changelog</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Get started">
        <div className="container">
          <div className="cta">
            <h2>Install once, import one stylesheet, ship.</h2>
            <div className="hero__actions" style={{ marginTop: 0 }}>
              <Link href="/docs/installation" className="btn" data-variant="primary" data-size="lg">
                Installation guide
              </Link>
              <a href={site.repo} className="btn" data-variant="secondary" data-size="lg">
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
