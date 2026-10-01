/**
 * English UI strings. This file defines the dictionary shape; every other locale must
 * provide the same keys (enforced by the `Dictionary` type in `tr.ts`).
 */
import { launchEn } from "./launch.en";

export const en = {
  meta: {
    tagline: "Accessible React components in plain CSS.",
    description:
      "Open source React component library with 60+ accessible components in plain CSS. Your styles override it without !important. Docs in English and Turkish.",
    ogHeadline: "React components that don’t fight your CSS.",
    ogSub: "Plain CSS · design tokens · WCAG 2.2 AA · MIT",
  },
  skipToContent: "Skip to content",
  header: {
    homeLabel: "Merid home",
    primaryNav: "Primary",
    nav: {
      docs: "Docs",
      foundations: "Foundations",
      components: "Components",
      integrations: "Integrations",
      patterns: "Patterns",
      blog: "Blog",
    },
    github: "Merid on GitHub",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    /** Label on the language switcher, written in the target language. */
    switchLanguage: "Türkçe",
    switchLanguageShort: "TR",
    switchLanguageLabel: "Bu sayfayı Türkçe oku",
  },
  search: {
    trigger: "Search",
    dialogLabel: "Search documentation",
    placeholder: "Search pages and sections",
    results: "Results",
    loadError: "The search index could not be loaded. Try again after a refresh.",
    noResults: (query: string) => `No results for “${query}”.`,
    hintMove: "to move,",
    hintOpen: "to open",
  },
  sidebar: {
    menu: "Menu",
    navLabel: "Documentation",
  },
  pager: {
    edit: "Edit this page on GitHub",
    navLabel: "Pagination",
    previous: "Previous",
    next: "Next",
  },
  toc: {
    title: "On this page",
  },
  copy: {
    copy: "Copy",
    copied: "Copied",
    failed: "Copy failed",
  },
  preview: {
    tablist: "Example",
    preview: "Preview",
    code: "Code",
    pending: "Live preview is added when this component ships.",
  },
  code: {
    regionLabel: (name: string) => `${name} code`,
  },
  table: {
    region: "Table",
  },
  callout: {
    info: "Note",
    warning: "Warning",
    danger: "Important",
    success: "Tip",
  },
  props: {
    region: "Props",
    prop: "Prop",
    type: "Type",
    default: "Default",
    description: "Description",
    required: "Required",
  },
  keyboard: {
    region: "Keyboard interactions",
    key: "Key",
    action: "Action",
  },
  doDont: {
    do: "Do",
    dont: "Avoid",
  },
  status: {
    stable: "Stable",
    beta: "Beta",
    planned: "Planned",
    deprecated: "Deprecated",
  },
  footer: {
    navLabel: "Footer",
    docs: "Docs",
    license: "License MIT",
    changelog: "Changelog",
    brand: "Brand",
  },
  notFound: {
    title: "Page not found",
    heading: "This page is off the map.",
    body: "The address may have changed when the documentation was reorganised. Search with ⌘K or start from the introduction.",
    docs: "Read the docs",
    home: "Go to the home page",
  },
  landing: {
    releaseBadge: "First public release",
    heroTitle: "React components that don’t fight your CSS.",
    heroLead: (count: number) =>
      `${count} accessible components, styled with one plain CSS file. Every rule sits in a cascade layer, so your own styles win without !important. The docs are in English and Turkish.`,
    getStarted: "Get started",
    installLabel: "Install command",
    playgroundTitle: "Try the tokens on a real screen.",
    playgroundText:
      "Accent, radius, density, theme and type scale are CSS custom properties. Change one and the dashboard, form and dialog below update, with the CSS it takes shown underneath.",
    indexTitle: (count: number) => `${count} components`,
    indexTitleMuted: ", one page each.",
    indexText:
      "From layout primitives to overlays. Each page has a live preview, props and accessibility notes, plus a keyboard map for the interactive ones.",
    indexLink: "Full index",
    contractTitle: "The six rules every component follows.",
    contractText: "Each rule has a page with its reasoning and the exact values it uses.",
    contractLink: "Principles",
    /** Rows link, in order, to the color, elevation, radius, typography, motion and styling pages. */
    contract: [
      { rule: "One accent, used sparingly", text: "A single accent marks what you can click and what's selected. Everything else stays neutral grey.", spec: "--mrd-accent" },
      { rule: "Rules before shadows", text: "Regions separate by tone first, then by a 1px line. Tables close on an ink rule, and only surfaces that float above the page cast a shadow.", spec: "--mrd-rule" },
      { rule: "Square-cut corners", text: "Controls are 2px, cards 3px and dialogs 4px, so a container is never sharper than what it holds. Only radios, switches and status dots are round.", spec: "--mrd-radius-*" },
      { rule: "Hierarchy from tone", text: "Three text tones. Hierarchy comes from tone and weight; colour is never a crutch for emphasis.", spec: "ink · body · muted" },
      { rule: "Short motion", text: "A pressed control sinks 1px in 80 milliseconds; everything else takes 120 to 160. Reduced motion turns all of it off.", spec: "--mrd-press" },
      { rule: "Open cascade", text: "Every rule lives in a named layer, so your styles win without !important.", spec: "@layer merid.*" },
    ],
    releaseDate: "28 September 2026",
    changelog: "Changelog",
    closingLabel: "Get started",
    closingText: "Install the package and import one stylesheet. Only toasts need a provider.",
    installation: "Installation",
  },
  playground: {
    settings: "Token editor",
    editorTitle: "Tokens",
    editorNote: "Every control sets custom properties on the preview. Nothing else changes.",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSplit: "Split",
    accent: "Accent",
    accents: { magenta: "Magenta (default)", petrol: "Petrol", brass: "Brass", graphite: "Graphite" },
    radius: "Radius",
    radii: { none: "None", default: "Sharp", soft: "Soft", round: "Round" },
    density: "Density",
    densities: { compact: "Compact", default: "Default", comfortable: "Roomy" },
    scale: "Type scale",
    reset: "Reset",
    keys: "Keys",
    splitPosition: "Meridian position",
    splitLight: "Light",
    splitDark: "Dark",
    previewLabel: "Live preview",
    address: "northwind.app/deployments",
    workspace: "Northwind",
    navLabel: "Workspace",
    navGroup: "Project",
    nav: { overview: "Overview", deployments: "Deployments", domains: "Domains", members: "Members", settings: "Settings" },
    pageTitle: "Deployments",
    pageMeta: "northwind-web · eu-central",
    newDeploy: "Deploy",
    filterLabel: "Environment",
    tabs: { all: "All", production: "Production", preview: "Preview" },
    tableLabel: "Deployments",
    columns: { commit: "Commit", status: "Status", branch: "Branch", age: "Age" },
    statuses: { ready: "Ready", building: "Building", failed: "Failed", queued: "Queued" },
    ago: (minutes: number) => (minutes < 60 ? `${minutes}m ago` : `${Math.round(minutes / 60)}h ago`),
    formTitle: "Project settings",
    projectName: "Project name",
    region: "Region",
    deployOnPush: "Deploy every push to main",
    requireReview: "Require review before production",
    cancel: "Cancel",
    save: "Save changes",
    dialogTitle: "Delete preview deployment?",
    dialogText: "feat/billing-v2 will stop serving traffic. Production is not affected.",
    dialogKeep: "Keep",
    dialogDelete: "Delete",
    diffTitle: "Generated CSS",
    diffChanged: (n: number) => (n === 1 ? "1 token changed" : `${n} tokens changed`),
    diffNone: "Defaults. Change a control to see the tokens it sets.",
    diffAttrs: "Attributes",
    copyCss: "Copy CSS",
  },
  catalogGroups: {
    Inputs: "Inputs",
    Layout: "Layout",
    Typography: "Typography",
    "Data display": "Data display",
    Feedback: "Feedback",
    Overlay: "Overlay",
    Navigation: "Navigation",
  },
  launch: launchEn,
};

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : { readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;
