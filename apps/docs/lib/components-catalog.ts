import type { ComponentStatus } from "@/components/StatusBadge";

export interface CatalogEntry {
  readonly name: string;
  readonly description: string;
  readonly status: ComponentStatus;
}

export const componentCatalog: readonly { readonly group: string; readonly items: readonly CatalogEntry[] }[] = [
  {
    group: "Inputs",
    items: [
      { name: "Button", description: "Primary, secondary, ghost, danger and link actions.", status: "planned" },
      { name: "IconButton", description: "Square button for a single icon with a required label.", status: "planned" },
      { name: "Input", description: "Single-line text field with invalid and disabled states.", status: "planned" },
      { name: "Textarea", description: "Multi-line text field.", status: "planned" },
      { name: "Select", description: "Choose one option from a list.", status: "planned" },
      { name: "Checkbox", description: "Toggle an independent option.", status: "planned" },
      { name: "Radio", description: "Choose one option from a small visible set.", status: "planned" },
      { name: "Switch", description: "Turn a setting on or off immediately.", status: "planned" },
      { name: "SegmentedControl", description: "Switch between a few views or modes.", status: "planned" },
      { name: "Field", description: "Label, helper text and error message for any control.", status: "planned" },
    ],
  },
  {
    group: "Layout",
    items: [
      { name: "Container", description: "Centres content at the container width with gutters.", status: "planned" },
      { name: "Stack", description: "Vertical or horizontal spacing on the token scale.", status: "planned" },
      { name: "Card", description: "Tray or elevated surface for grouped content.", status: "planned" },
      { name: "Separator", description: "A 1px hairline between regions.", status: "planned" },
    ],
  },
  {
    group: "Data display",
    items: [
      { name: "Table", description: "Tabular data with hairline rows and tabular numbers.", status: "planned" },
      { name: "Badge", description: "Short status or count in six tones.", status: "planned" },
      { name: "Avatar", description: "Image or initials for a person or organisation.", status: "planned" },
      { name: "Accordion", description: "Stacked disclosure sections.", status: "planned" },
      { name: "Tabs", description: "Line tabs for switching panels.", status: "planned" },
    ],
  },
  {
    group: "Feedback",
    items: [
      { name: "Alert", description: "Inline notice in info, success, warning or danger tones.", status: "planned" },
      { name: "Toast", description: "Brief, non-blocking confirmation.", status: "planned" },
      { name: "Spinner", description: "Indeterminate progress for short waits.", status: "beta" },
      { name: "Skeleton", description: "Placeholder shapes while content loads.", status: "planned" },
    ],
  },
  {
    group: "Overlay",
    items: [
      { name: "Dialog", description: "Modal window for a focused task.", status: "beta" },
      { name: "AlertDialog", description: "Modal confirmation that requires a response.", status: "beta" },
      { name: "Drawer", description: "Panel that slides in from an edge.", status: "beta" },
      { name: "Popover", description: "Non-modal floating panel anchored to a trigger.", status: "beta" },
      { name: "Tooltip", description: "Short label on hover and focus.", status: "beta" },
      { name: "Menu", description: "List of actions opened from a button.", status: "planned" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { name: "Link", description: "Inline and standalone links.", status: "planned" },
      { name: "Breadcrumbs", description: "The current page's position in a hierarchy.", status: "planned" },
      { name: "Pagination", description: "Move between pages of results.", status: "planned" },
    ],
  },
];
