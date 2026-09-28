export interface NavItem {
  readonly title: string;
  readonly href: string;
}

export interface NavGroup {
  readonly title: string;
  readonly items: readonly NavItem[];
}

export const docsNav: readonly NavGroup[] = [
  {
    title: "Getting started",
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Usage", href: "/docs/usage" },
      { title: "Styling and CSS layers", href: "/docs/styling" },
      { title: "Server components", href: "/docs/server-components" },
      { title: "Browser support", href: "/docs/browser-support" },
      { title: "Accessibility", href: "/docs/accessibility" },
      { title: "Versioning", href: "/docs/versioning" },
      { title: "Changelog", href: "/docs/changelog" },
      { title: "Roadmap", href: "/docs/roadmap" },
      { title: "FAQ", href: "/docs/faq" },
      { title: "Contributing", href: "/docs/contributing" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { title: "Design tokens", href: "/docs/foundations" },
      { title: "Color", href: "/docs/foundations/color" },
      { title: "Dark mode", href: "/docs/foundations/dark-mode" },
      { title: "Typography", href: "/docs/foundations/typography" },
      { title: "Spacing", href: "/docs/foundations/spacing" },
      { title: "Radius", href: "/docs/foundations/radius" },
      { title: "Elevation", href: "/docs/foundations/elevation" },
      { title: "Motion", href: "/docs/foundations/motion" },
      { title: "Breakpoints and layers", href: "/docs/foundations/layout" },
      { title: "Principles", href: "/docs/foundations/principles" },
    ],
  },
  {
    title: "Components",
    items: [{ title: "Overview", href: "/docs/components" }],
  },
  {
    title: "Brand",
    items: [{ title: "Logo and usage", href: "/docs/brand" }],
  },
];

export const flatNav: readonly NavItem[] = docsNav.flatMap((g) => g.items);

export function findNeighbours(pathname: string): {
  prev: NavItem | undefined;
  next: NavItem | undefined;
  current: NavItem | undefined;
} {
  const index = flatNav.findIndex((item) => item.href === pathname);
  if (index === -1) return { prev: undefined, next: undefined, current: undefined };
  return { prev: flatNav[index - 1], next: flatNav[index + 1], current: flatNav[index] };
}
