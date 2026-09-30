import type { ComponentStatus } from "@/components/StatusBadge";
import { catalogDescriptionsTr } from "@/lib/i18n/catalog.tr";
import { getDictionary, type Locale } from "@/lib/i18n";

export interface CatalogEntry {
  readonly name: string;
  /** Page slug under /docs/components. */
  readonly slug: string;
  readonly description: string;
  readonly status: ComponentStatus;
}

export const componentCatalog: readonly { readonly group: string; readonly items: readonly CatalogEntry[] }[] = [
  {
    group: "Inputs",
    items: [
      { name: "Button", slug: "button", description: "Primary, secondary, ghost, danger and link actions.", status: "stable" },
      { name: "IconButton", slug: "icon-button", description: "Square button for a single icon with a required label.", status: "stable" },
      { name: "Label", slug: "label", description: "Accessible label for a form control.", status: "stable" },
      { name: "Field", slug: "field", description: "Label, helper text and error message for any control.", status: "stable" },
      { name: "Input", slug: "input", description: "Single-line text field with invalid and disabled states.", status: "stable" },
      { name: "Textarea", slug: "textarea", description: "Multi-line text field.", status: "stable" },
      { name: "NativeSelect", slug: "native-select", description: "Styled native select element.", status: "stable" },
      { name: "Select", slug: "select", description: "Choose one option from a custom listbox.", status: "stable" },
      { name: "Checkbox", slug: "checkbox", description: "Toggle an independent option.", status: "stable" },
      { name: "Radio", slug: "radio", description: "Choose one option from a small visible set.", status: "stable" },
      { name: "Switch", slug: "switch", description: "Turn a setting on or off immediately.", status: "stable" },
      { name: "SegmentedControl", slug: "segmented-control", description: "Switch between a few views or modes.", status: "stable" },
      { name: "Toolbar", slug: "toolbar", description: "A row of related controls with one Tab stop.", status: "beta" },
    ],
  },
  {
    group: "Layout",
    items: [
      { name: "Container", slug: "container", description: "Centres content at the container width with gutters.", status: "stable" },
      { name: "Section", slug: "section", description: "Vertical page section with consistent padding.", status: "stable" },
      { name: "Stack", slug: "stack", description: "Vertical or horizontal spacing on the token scale.", status: "stable" },
      { name: "Grid", slug: "grid", description: "Responsive column grid.", status: "stable" },
      { name: "Card", slug: "card", description: "Tray or elevated surface for grouped content.", status: "stable" },
      { name: "Separator", slug: "separator", description: "A 1px hairline between regions.", status: "stable" },
      { name: "ScrollArea", slug: "scroll-area", description: "Native scrolling with thin, themed scrollbars.", status: "beta" },
    ],
  },
  {
    group: "Typography",
    items: [
      { name: "Heading", slug: "heading", description: "Tight, balanced headings at each level.", status: "stable" },
      { name: "Text", slug: "text", description: "Body text in the three tones.", status: "stable" },
      { name: "Code", slug: "code", description: "Inline code.", status: "stable" },
      { name: "Kbd", slug: "kbd", description: "Keyboard key.", status: "stable" },
      { name: "VisuallyHidden", slug: "visually-hidden", description: "Content for assistive technology only.", status: "stable" },
      { name: "Shortcut", slug: "shortcut", description: "Platform-aware key combination such as ⌘K.", status: "beta" },
    ],
  },
  {
    group: "Data display",
    items: [
      { name: "Table", slug: "table", description: "Tabular data with hairline rows and tabular numbers.", status: "stable" },
      { name: "Badge", slug: "badge", description: "Short status or count in six tones.", status: "stable" },
      { name: "Avatar", slug: "avatar", description: "Image or initials for a person or organisation.", status: "stable" },
      { name: "Accordion", slug: "accordion", description: "Stacked disclosure sections.", status: "stable" },
      { name: "Tabs", slug: "tabs", description: "Line tabs for switching panels.", status: "stable" },
      { name: "EmptyState", slug: "empty-state", description: "Placeholder when there is nothing to show yet.", status: "stable" },
      { name: "Collapsible", slug: "collapsible", description: "Show and hide one region.", status: "beta" },
      { name: "DataTable", slug: "data-table", description: "Sorting, filtering, pagination and row selection on Table.", status: "beta" },
    ],
  },
  {
    group: "Feedback",
    items: [
      { name: "Alert", slug: "alert", description: "Inline notice in info, success, warning or danger tones.", status: "stable" },
      { name: "Toast", slug: "toast", description: "Brief, non-blocking confirmation.", status: "stable" },
      { name: "Progress", slug: "progress", description: "Determinate progress bar.", status: "stable" },
      { name: "Spinner", slug: "spinner", description: "Indeterminate progress for short waits.", status: "stable" },
      { name: "Skeleton", slug: "skeleton", description: "Placeholder shapes while content loads.", status: "stable" },
    ],
  },
  {
    group: "Overlay",
    items: [
      { name: "Dialog", slug: "dialog", description: "Modal window for a focused task.", status: "stable" },
      { name: "AlertDialog", slug: "alert-dialog", description: "Modal confirmation that requires a response.", status: "stable" },
      { name: "Drawer", slug: "drawer", description: "Panel that slides in from an edge.", status: "stable" },
      { name: "Popover", slug: "popover", description: "Non-modal floating panel anchored to a trigger.", status: "stable" },
      { name: "Tooltip", slug: "tooltip", description: "Short label on hover and focus.", status: "stable" },
      { name: "DropdownMenu", slug: "dropdown-menu", description: "List of actions opened from a button.", status: "stable" },
      { name: "Portal", slug: "portal", description: "Render children into document.body.", status: "stable" },
      { name: "Command", slug: "command", description: "Searchable command menu and ⌘K palette.", status: "beta" },
      { name: "ContextMenu", slug: "context-menu", description: "Right-click menu of actions.", status: "beta" },
      { name: "HoverCard", slug: "hover-card", description: "Preview card on hover or focus of a link.", status: "beta" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { name: "Link", slug: "link", description: "Inline and standalone links.", status: "stable" },
      { name: "Breadcrumb", slug: "breadcrumb", description: "The current page's position in a hierarchy.", status: "stable" },
      { name: "Pagination", slug: "pagination", description: "Move between pages of results.", status: "stable" },
      { name: "Stepper", slug: "stepper", description: "Progress through a multi-step flow.", status: "stable" },
      { name: "SidebarNav", slug: "sidebar-nav", description: "Grouped vertical navigation for app sidebars.", status: "stable" },
      { name: "NavigationMenu", slug: "navigation-menu", description: "Top site navigation with drop-down and mega menus.", status: "beta" },
    ],
  },
];

/** The catalog with group names and descriptions in one locale. Component names are never translated. */
export function catalogFor(locale: Locale): typeof componentCatalog {
  if (locale === "en") return componentCatalog;
  const groups: Readonly<Record<string, string>> = getDictionary(locale).catalogGroups;
  return componentCatalog.map((group) => ({
    group: groups[group.group] ?? group.group,
    items: group.items.map((item) => ({ ...item, description: catalogDescriptionsTr[item.slug] ?? item.description })),
  }));
}

export const componentCount = componentCatalog.reduce((sum, group) => sum + group.items.length, 0);
