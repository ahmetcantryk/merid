import { localeFromPath, localizePath, stripLocale, type Locale } from "@/lib/i18n/config";
import { navGroupTitlesTr, navTitlesTr } from "@/lib/i18n/nav.tr";

export interface NavItem {
  readonly title: string;
  /** Locale-neutral in `docsNav` (`/docs/usage`); localized in the result of `navFor`. */
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
      { title: "CLI", href: "/docs/cli" },
      { title: "Using Merid with AI", href: "/docs/ai" },
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
    items: [
      { title: "Overview", href: "/docs/components" },
      { title: "Accordion", href: "/docs/components/accordion" },
      { title: "Alert", href: "/docs/components/alert" },
      { title: "AlertDialog", href: "/docs/components/alert-dialog" },
      { title: "Avatar", href: "/docs/components/avatar" },
      { title: "Badge", href: "/docs/components/badge" },
      { title: "Breadcrumb", href: "/docs/components/breadcrumb" },
      { title: "Button", href: "/docs/components/button" },
      { title: "Calendar", href: "/docs/components/calendar" },
      { title: "Card", href: "/docs/components/card" },
      { title: "Checkbox", href: "/docs/components/checkbox" },
      { title: "Code", href: "/docs/components/code" },
      { title: "Collapsible", href: "/docs/components/collapsible" },
      { title: "Combobox", href: "/docs/components/combobox" },
      { title: "Command", href: "/docs/components/command" },
      { title: "Container", href: "/docs/components/container" },
      { title: "ContextMenu", href: "/docs/components/context-menu" },
      { title: "DataTable", href: "/docs/components/data-table" },
      { title: "DatePicker", href: "/docs/components/date-picker" },
      { title: "Dialog", href: "/docs/components/dialog" },
      { title: "Drawer", href: "/docs/components/drawer" },
      { title: "DropdownMenu", href: "/docs/components/dropdown-menu" },
      { title: "EmptyState", href: "/docs/components/empty-state" },
      { title: "Field", href: "/docs/components/field" },
      { title: "FileUpload", href: "/docs/components/file-upload" },
      { title: "Grid", href: "/docs/components/grid" },
      { title: "Heading", href: "/docs/components/heading" },
      { title: "HoverCard", href: "/docs/components/hover-card" },
      { title: "IconButton", href: "/docs/components/icon-button" },
      { title: "Input", href: "/docs/components/input" },
      { title: "Kbd", href: "/docs/components/kbd" },
      { title: "Label", href: "/docs/components/label" },
      { title: "Link", href: "/docs/components/link" },
      { title: "NativeSelect", href: "/docs/components/native-select" },
      { title: "NavigationMenu", href: "/docs/components/navigation-menu" },
      { title: "NumberInput", href: "/docs/components/number-input" },
      { title: "Pagination", href: "/docs/components/pagination" },
      { title: "PinInput", href: "/docs/components/pin-input" },
      { title: "Popover", href: "/docs/components/popover" },
      { title: "Portal", href: "/docs/components/portal" },
      { title: "Progress", href: "/docs/components/progress" },
      { title: "Radio", href: "/docs/components/radio" },
      { title: "ScrollArea", href: "/docs/components/scroll-area" },
      { title: "Section", href: "/docs/components/section" },
      { title: "SegmentedControl", href: "/docs/components/segmented-control" },
      { title: "Select", href: "/docs/components/select" },
      { title: "Separator", href: "/docs/components/separator" },
      { title: "Shortcut", href: "/docs/components/shortcut" },
      { title: "SidebarNav", href: "/docs/components/sidebar-nav" },
      { title: "Skeleton", href: "/docs/components/skeleton" },
      { title: "Slider", href: "/docs/components/slider" },
      { title: "Spinner", href: "/docs/components/spinner" },
      { title: "Stack", href: "/docs/components/stack" },
      { title: "Stepper", href: "/docs/components/stepper" },
      { title: "Switch", href: "/docs/components/switch" },
      { title: "Table", href: "/docs/components/table" },
      { title: "Tabs", href: "/docs/components/tabs" },
      { title: "Text", href: "/docs/components/text" },
      { title: "Textarea", href: "/docs/components/textarea" },
      { title: "Toast", href: "/docs/components/toast" },
      { title: "ToggleGroup", href: "/docs/components/toggle-group" },
      { title: "Toolbar", href: "/docs/components/toolbar" },
      { title: "Tooltip", href: "/docs/components/tooltip" },
      { title: "VisuallyHidden", href: "/docs/components/visually-hidden" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { title: "React Hook Form", href: "/docs/integrations/react-hook-form" },
      { title: "Validation with Zod", href: "/docs/integrations/zod" },
      { title: "Next.js", href: "/docs/integrations/nextjs" },
      { title: "React Router and TanStack", href: "/docs/integrations/routers" },
      { title: "Vite", href: "/docs/integrations/vite" },
      { title: "Tailwind CSS", href: "/docs/integrations/tailwind" },
      { title: "Icons", href: "/docs/integrations/icons" },
      { title: "Figma and Style Dictionary", href: "/docs/integrations/design-tokens" },
      { title: "Plain HTML and CSS", href: "/docs/integrations/html" },
      { title: "Subtree attributes", href: "/docs/integrations/subtree-attributes" },
      { title: "Theming a brand", href: "/docs/integrations/theming" },
      { title: "Dark mode strategies", href: "/docs/integrations/dark-mode" },
      { title: "Internationalization and RTL", href: "/docs/integrations/rtl" },
    ],
  },
  {
    title: "Patterns",
    items: [
      { title: "Forms", href: "/docs/patterns/forms" },
      { title: "Empty and loading states", href: "/docs/patterns/empty-and-loading" },
      { title: "Confirmations", href: "/docs/patterns/confirmations" },
      { title: "Data tables", href: "/docs/patterns/data-tables" },
      { title: "Settings pages", href: "/docs/patterns/settings" },
      { title: "Authentication", href: "/docs/patterns/authentication" },
      { title: "Navigation layouts", href: "/docs/patterns/app-shell" },
    ],
  },
  {
    title: "Brand",
    items: [{ title: "Logo and usage", href: "/docs/brand" }],
  },
];

export const flatNav: readonly NavItem[] = docsNav.flatMap((g) => g.items);

/** The sidebar tree with titles and hrefs for one locale. */
export function navFor(locale: Locale): readonly NavGroup[] {
  if (locale === "en") return docsNav;
  return docsNav.map((group) => ({
    title: navGroupTitlesTr[group.title] ?? group.title,
    items: group.items.map((item) => ({
      title: navTitlesTr[item.href] ?? item.title,
      href: localizePath(item.href, locale),
    })),
  }));
}

/** Previous, next and current page for a (possibly localized) pathname, in that page's locale. */
export function findNeighbours(pathname: string): {
  prev: NavItem | undefined;
  next: NavItem | undefined;
  current: NavItem | undefined;
} {
  const items = navFor(localeFromPath(pathname)).flatMap((g) => g.items);
  const index = flatNav.findIndex((item) => item.href === stripLocale(pathname));
  if (index === -1) return { prev: undefined, next: undefined, current: undefined };
  return { prev: items[index - 1], next: items[index + 1], current: items[index] };
}
