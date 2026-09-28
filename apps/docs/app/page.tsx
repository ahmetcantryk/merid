import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { site } from "@/lib/site";
import { ComponentIndex, componentCount } from "./_landing/ComponentIndex";
import { FoundationIndex } from "./_landing/FoundationIndex";
import { Playground } from "./_landing/Playground";

/** Each principle paired with the token or rule that enforces it. */
const CONTRACT = [
  { rule: "One accent, used sparingly", text: "A single cool blue carries interaction and selection. Everything else is ink-tinted neutral.", spec: "--mrd-accent" },
  { rule: "Surface before border", text: "Trays separate regions first. A hairline is the last resort, never a heavier rule.", spec: "--mrd-tray" },
  { rule: "Hairlines only", text: "Every border is one pixel. Selection is a 1.5px accent ring. Never two, never dark.", spec: "1px --mrd-line" },
  { rule: "Hierarchy from tone", text: "Three text tones and two weights. Colour is never a crutch for emphasis.", spec: "ink · body · muted" },
  { rule: "Quiet interaction", text: "Tints and a .97 press in 150 to 200 milliseconds. Reduced motion removes all of it.", spec: "--mrd-duration" },
  { rule: "Open cascade", text: "Every rule lives in a named layer, so your styles win without !important.", spec: "@layer merid.*" },
] as const;

const RELEASE_NOTES = [
  ["Foundations", "Colour, type, spacing, radius, elevation and motion tokens with light and dark values."],
  ["Components", `${componentCount} accessible components, from layout primitives to Select, Tabs, Table and Toast.`],
  ["Overlays", "Dialog, Drawer, AlertDialog, Popover and DropdownMenu with focus management."],
  ["Accessibility", "AA-contrast tokens and WAI-ARIA keyboard patterns for every interactive part."],
  ["Styling", "One stylesheet, three cascade layers, no runtime CSS-in-JS and no build plugin."],
] as const;

export default function HomePage() {
  return (
    <div className="board">
      <section className="band hero" aria-labelledby="hero-title">
        <div className="frame">
          <div className="hero__grid">
            <div>
              <Link href="/docs/changelog" className="hero__version">
                <span className="hero__version-tag">v{site.version}</span>
                <span>First public release</span>
                <span aria-hidden="true">→</span>
              </Link>
              <h1 id="hero-title">Quiet, precise components for&nbsp;React.</h1>
              <p className="hero__lead">
                {componentCount} accessible components in plain CSS and one set of tokens. Hairlines, one cool accent and
                calm motion — for products that read as engineered, not decorated.
              </p>
              <div className="hero__actions">
                <Link href="/docs/introduction" className="btn" data-variant="primary">
                  Get started
                </Link>
                <Link href="/docs/components" className="btn" data-variant="secondary">
                  Components
                </Link>
                <div className="install" aria-label="Install command">
                  <span className="install__prompt" aria-hidden="true">$</span>
                  <code>{site.install}</code>
                  <CopyButton value={site.install} className="install__copy" />
                </div>
              </div>
            </div>
            <dl className="hero__spec">
              <div>
                <dt>Components</dt>
                <dd>{componentCount}</dd>
              </div>
              <div>
                <dt>Stylesheets</dt>
                <dd>1</dd>
              </div>
              <div>
                <dt>Cascade layers</dt>
                <dd>3</dd>
              </div>
              <div>
                <dt>License</dt>
                <dd>MIT</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="playground-title">
        <div className="frame">
          <div className="band__head">
            <h2 id="playground-title">Change a token, not a component.</h2>
            <p>
              Theme, accent and density are custom properties. Flip them and every control below follows — this is the
              real library, not a screenshot.
            </p>
          </div>
          <Playground />
        </div>
      </section>

      <section className="band" aria-labelledby="index-title">
        <div className="frame">
          <div className="band__head">
            <h2 id="index-title">
              {componentCount} components<span className="band__head-muted">, one contract.</span>
            </h2>
            <p>
              From layout primitives to overlays. Each page has a live preview, props, keyboard map and accessibility
              notes. <Link href="/docs/components">Full index</Link>
            </p>
          </div>
          <ComponentIndex />
        </div>
      </section>

      <section className="band" aria-labelledby="contract-title">
        <div className="frame">
          <div className="band__head">
            <h2 id="contract-title">Six rules, applied everywhere.</h2>
            <p>
              Every component follows the same design contract, so a page built from Merid holds together without a
              review. <Link href="/docs/foundations/principles">Principles</Link>
            </p>
          </div>
          <ol className="contract">
            {CONTRACT.map((c, i) => (
              <li key={c.rule}>
                <span className="contract__index">{String(i + 1).padStart(2, "0")}</span>
                <span className="contract__rule">{c.rule}</span>
                <span className="contract__text">{c.text}</span>
                <code className="contract__spec">{c.spec}</code>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band" aria-labelledby="foundations-title">
        <div className="frame">
          <div className="band__head">
            <h2 id="foundations-title">Foundations</h2>
            <p>The tokens behind every component, with light and dark values and the reason each one exists.</p>
          </div>
          <FoundationIndex />
        </div>
      </section>

      <section className="band" aria-labelledby="release-title">
        <div className="frame">
          <div className="release">
            <div className="release__meta">
              <h2 id="release-title">What’s new</h2>
              <p>
                <code>v{site.version}</code> · <time dateTime={site.releaseDate}>28 September 2026</time>
              </p>
              <Link href="/docs/changelog">Changelog</Link>
            </div>
            <ul className="release__list">
              {RELEASE_NOTES.map(([area, note]) => (
                <li key={area}>
                  <span>{area}</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="band band--end" aria-label="Get started">
        <div className="frame">
          <div className="closing">
            <p className="closing__cmd">
              <span aria-hidden="true">$ </span>
              {site.install}
            </p>
            <p className="closing__text">Install once, import one stylesheet, ship.</p>
            <div className="hero__actions">
              <Link href="/docs/installation" className="btn" data-variant="primary">
                Installation
              </Link>
              <a href={site.repo} className="btn" data-variant="secondary">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
