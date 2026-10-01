// Global styles that project generators write and that override Merid. Every rule below is copied from real
// generator output (create-vite 5–9, create-next-app 15–16, create-react-router 7–8). A rule only counts as a
// template rule when it still matches the original, formatting aside; anything the user has edited is theirs.
import { editStatements, normalizeCss, topLevelStatements, type CssEdit } from "./css.js";
import type { Framework } from "./detect.js";

export interface TemplateRule {
  /** The rule as the generator writes it. */
  readonly css: string;
  /** What it does to a Merid app. */
  readonly effect: string;
  /** Written in place of the rule when part of it is worth keeping. */
  readonly keep?: string;
}

export interface TemplateStyles {
  readonly name: string;
  /** Stylesheets the generator creates, relative to the project root. */
  readonly files: readonly string[];
  readonly rules: readonly TemplateRule[];
}

const VITE_RULES: readonly TemplateRule[] = [
  // create-vite 9
  {
    effect: "page font, size, colours and background",
    css: `:root {
  --text: #6b6375;
  --text-h: #08060d;
  --bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #aa3bff;
  --accent-bg: rgba(170, 59, 255, 0.1);
  --accent-border: rgba(170, 59, 255, 0.5);
  --social-bg: rgba(244, 243, 236, 0.5);
  --shadow:
    rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;

  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
  --heading: system-ui, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);
  letter-spacing: 0.18px;
  color-scheme: light dark;
  color: var(--text);
  background: var(--bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 1024px) {
    font-size: 16px;
  }
}`,
  },
  {
    effect: "the template's dark palette",
    css: `@media (prefers-color-scheme: dark) {
  :root {
    --text: #9ca3af;
    --text-h: #f3f4f6;
    --bg: #16171d;
    --border: #2e303a;
    --code-bg: #1f2028;
    --accent: #c084fc;
    --accent-bg: rgba(192, 132, 252, 0.15);
    --accent-border: rgba(192, 132, 252, 0.5);
    --social-bg: rgba(47, 48, 58, 0.5);
    --shadow:
      rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
  }

  #social .button-icon {
    filter: invert(1) brightness(2);
  }
}`,
  },
  {
    effect: "a fixed 1126px column with centred text",
    css: `#root {
  width: 1126px;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  border-inline: 1px solid var(--border);
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}`,
  },
  {
    effect: "heading font, weight and colour",
    css: `h1,
h2 {
  font-family: var(--heading);
  font-weight: 500;
  color: var(--text-h);
}`,
  },
  {
    effect: "heading sizes and margins",
    css: `h1 {
  font-size: 56px;
  letter-spacing: -1.68px;
  margin: 32px 0;
  @media (max-width: 1024px) {
    font-size: 36px;
    margin: 20px 0;
  }
}`,
  },
  {
    effect: "heading sizes and margins",
    css: `h2 {
  font-size: 24px;
  line-height: 118%;
  letter-spacing: -0.24px;
  margin: 0 0 8px;
  @media (max-width: 1024px) {
    font-size: 20px;
  }
}`,
  },
  { effect: "removes the spacing Merid gives dialog and empty-state text", css: `p {\n  margin: 0;\n}` },
  {
    effect: "font, colour and padding of code",
    css: `code,
.counter {
  font-family: var(--mono);
  display: inline-flex;
  border-radius: 4px;
  color: var(--text-h);
}`,
  },
  {
    effect: "font, colour and padding of code",
    css: `code {
  font-size: 15px;
  line-height: 135%;
  padding: 4px 8px;
  background: var(--code-bg);
}`,
  },
  // create-vite 5–8 (6–8 dropped Inter from the font stack)
  ...[`Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`, `system-ui, Avenir, Helvetica, Arial, sans-serif`].map((stack) => ({
    effect: "page font, colours and a dark background",
    css: `:root {
  font-family: ${stack};
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
  })),
  { effect: "link weight and colour", css: `a {\n  font-weight: 500;\n  color: #646cff;\n  text-decoration: inherit;\n}` },
  { effect: "link colour", css: `a:hover {\n  color: #535bf2;\n}` },
  {
    effect: "centres the whole app as one flex item (keeps margin: 0)",
    keep: `body {\n  margin: 0;\n}`,
    css: `body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}`,
  },
  { effect: "heading size", css: `h1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}` },
  {
    effect: "button padding, radius, border and background",
    css: `button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}`,
  },
  { effect: "button border colour", css: `button:hover {\n  border-color: #646cff;\n}` },
  {
    effect: "focus ring",
    css: `button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}`,
  },
  {
    effect: "light-mode colours for the page, links and buttons",
    css: `@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}`,
  },
  {
    effect: "a 1280px column with padding and centred text",
    css: `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}`,
  },
];

const NEXT_RULES: readonly TemplateRule[] = [
  // create-next-app 15–16 with Tailwind
  {
    effect: "Arial and the template colours",
    css: `body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}`,
  },
  // create-next-app 16 without Tailwind
  {
    effect: "Arial and the template colours (keeps the layout, and margin: 0 from the * reset)",
    keep: `body {\n  min-height: 100%;\n  display: flex;\n  flex-direction: column;\n  margin: 0;\n}`,
    css: `body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
  },
  // create-next-app 15 without Tailwind
  {
    effect: "Arial and the template colours (keeps margin: 0 from the * reset)",
    keep: `body {\n  margin: 0;\n}`,
    css: `body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
  },
  { effect: "zero padding and margin on every Merid component", css: `* {\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n}` },
  { effect: "removes link colour and underline", css: `a {\n  color: inherit;\n  text-decoration: none;\n}` },
  {
    effect: "dark form controls and scrollbars on a light Merid theme",
    css: `@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}`,
  },
];

const REACT_ROUTER_RULES: readonly TemplateRule[] = [
  {
    effect: "white (or gray-950) page background",
    css: `html,
body {
  @apply bg-white dark:bg-gray-950;

  @media (prefers-color-scheme: dark) {
    color-scheme: dark;
  }
}`,
  },
];

export const TEMPLATE_STYLES: Readonly<Record<Framework, TemplateStyles>> = {
  vite: { name: "Vite", files: ["src/index.css", "src/App.css"], rules: VITE_RULES },
  next: { name: "Next.js", files: ["app/globals.css", "src/app/globals.css"], rules: NEXT_RULES },
  "react-router": { name: "React Router", files: ["app/app.css"], rules: REACT_ROUTER_RULES },
};

export interface TemplateMatch {
  readonly rule: TemplateRule;
  /** Selector or at-rule prelude, for messages. */
  readonly selector: string;
  readonly edit: CssEdit;
}

const index = (rules: readonly TemplateRule[]) => new Map(rules.map((rule) => [normalizeCss(rule.css), rule]));
const INDEX = new Map((Object.keys(TEMPLATE_STYLES) as Framework[]).map((f) => [f, index(TEMPLATE_STYLES[f].rules)]));

const selectorOf = (text: string) => text.slice(0, text.indexOf("{")).replace(/\s+/g, " ").trim();

/** The template rules still present in a stylesheet. */
export function findTemplateRules(source: string, framework: Framework): TemplateMatch[] {
  const known = INDEX.get(framework);
  if (!known) return [];
  const matches: TemplateMatch[] = [];
  for (const statement of topLevelStatements(source)) {
    const rule = known.get(normalizeCss(statement.text));
    if (rule) matches.push({ rule, selector: selectorOf(statement.text), edit: { statement, replacement: rule.keep } });
  }
  return matches;
}

/** The stylesheet without its template rules (rules with a `keep` part are trimmed to it). */
export function removeTemplateRules(source: string, framework: Framework): string {
  return editStatements(
    source,
    findTemplateRules(source, framework).map((m) => m.edit),
  );
}

/** "`:root`, `#root` and `h1, h2`" (or "… and 3 more"), for messages. */
export function listSelectors(matches: readonly TemplateMatch[], max = 4): string {
  const names = [...new Set(matches.map((m) => `\`${m.selector}\``))];
  if (names.length <= 1) return names[0] ?? "";
  if (names.length > max) return `${names.slice(0, max - 1).join(", ")} and ${names.length - max + 1} more`;
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}
