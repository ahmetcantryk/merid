/**
 * English UI strings. This file defines the dictionary shape; every other locale must
 * provide the same keys (enforced by the `Dictionary` type in `tr.ts`).
 */
export const en = {
  meta: {
    tagline: "Quiet, precise React components.",
    description:
      "Merid is an accessible React component library built on plain CSS and a small set of design tokens: 1px hairlines, one cool accent, soft grey trays and calm motion.",
    ogHeadline: "Quiet, precise components for React.",
    ogSub: "Plain CSS · design tokens · WCAG 2.2 AA · MIT",
  },
  skipToContent: "Skip to content",
  header: {
    homeLabel: "Merid home",
    versionLabel: (version: string) => `Version ${version}, changelog`,
    primaryNav: "Primary",
    nav: {
      docs: "Docs",
      foundations: "Foundations",
      components: "Components",
      integrations: "Integrations",
      patterns: "Patterns",
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
    heroTitle: "Quiet, precise components for React.",
    heroLead: (count: number) =>
      `${count} accessible components in plain CSS and one set of tokens. Hairlines, one cool accent and calm motion — for products that read as engineered, not decorated.`,
    getStarted: "Get started",
    components: "Components",
    installLabel: "Install command",
    spec: {
      components: "Components",
      stylesheets: "Stylesheets",
      layers: "Cascade layers",
      license: "License",
    },
    playgroundTitle: "Change a token, not a component.",
    playgroundText:
      "Theme, accent and density are custom properties. Flip them and every control below follows — this is the real library, not a screenshot.",
    indexTitle: (count: number) => `${count} components`,
    indexTitleMuted: ", one contract.",
    indexText: "From layout primitives to overlays. Each page has a live preview, props, keyboard map and accessibility notes.",
    indexLink: "Full index",
    contractTitle: "Six rules, applied everywhere.",
    contractText: "Every component follows the same design contract, so a page built from Merid holds together without a review.",
    contractLink: "Principles",
    contract: [
      { rule: "One accent, used sparingly", text: "A single cool blue carries interaction and selection. Everything else is ink-tinted neutral.", spec: "--mrd-accent" },
      { rule: "Surface before border", text: "Trays separate regions first. A hairline is the last resort, never a heavier rule.", spec: "--mrd-tray" },
      { rule: "Hairlines only", text: "Every border is one pixel. Selection is a 1.5px accent ring. Never two, never dark.", spec: "1px --mrd-line" },
      { rule: "Hierarchy from tone", text: "Three text tones and two weights. Colour is never a crutch for emphasis.", spec: "ink · body · muted" },
      { rule: "Quiet interaction", text: "Tints and a .97 press in 150 to 200 milliseconds. Reduced motion removes all of it.", spec: "--mrd-duration" },
      { rule: "Open cascade", text: "Every rule lives in a named layer, so your styles win without !important.", spec: "@layer merid.*" },
    ],
    foundationsTitle: "Foundations",
    foundationsText: "The tokens behind every component, with light and dark values and the reason each one exists.",
    foundations: {
      color: { title: "Color", text: "One accent, ink-tinted neutrals, quiet status tones." },
      typography: { title: "Typography", text: "Geist and Geist Mono, nine sizes, three weights." },
      spacing: { title: "Spacing", text: "A 4 and 8 pixel scale up to the section rhythm." },
      radius: { title: "Radius", text: "Corners that step down as surfaces nest." },
      elevation: { title: "Elevation", text: "Soft ink-tinted shadows, a ring in dark mode." },
      motion: { title: "Motion", text: "Three durations and one easing curve." },
      darkMode: { title: "Dark mode", text: "System preference or a data-theme attribute." },
      layout: { title: "Layout", text: "Container, gutter, section and reading widths." },
    },
    releaseTitle: "What’s new",
    releaseDate: "28 September 2026",
    changelog: "Changelog",
    releaseNotes: (count: number) => [
      ["Foundations", "Colour, type, spacing, radius, elevation and motion tokens with light and dark values."],
      ["Components", `${count} accessible components, from layout primitives to Select, Tabs, Table and Toast.`],
      ["Overlays", "Dialog, Drawer, AlertDialog, Popover and DropdownMenu with focus management."],
      ["Accessibility", "AA-contrast tokens and WAI-ARIA keyboard patterns for every interactive part."],
      ["Styling", "One stylesheet, three cascade layers, no runtime CSS-in-JS and no build plugin."],
    ] as const,
    closingLabel: "Get started",
    closingText: "Install once, import one stylesheet, ship.",
    installation: "Installation",
  },
  playground: {
    settings: "Playground settings",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    accent: "Accent",
    accents: { blue: "Blue (default)", violet: "Violet", green: "Green", graphite: "Graphite" },
    density: "Density",
    densities: { compact: "Compact", default: "Default", comfortable: "Roomy" },
    projectMeta: "Production · eu-central",
    healthy: "Healthy",
    projectTabs: "Project",
    tabGeneral: "General",
    tabMembers: "Members",
    tabUsage: "Usage",
    projectName: "Project name",
    region: "Region",
    deployOnPush: "Deploy every push to main",
    requireReview: "Require review before production",
    roles: { owner: "Owner", admin: "Admin", viewer: "Viewer" },
    buildMinutes: "Build minutes",
    usage: "640 of 1,000 build minutes this month",
    cancel: "Cancel",
    save: "Save changes",
    tokensNote: "Three attributes on any element. They nest, need no provider and add no runtime styles.",
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
};

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : { readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;
