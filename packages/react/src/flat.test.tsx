import * as Merid from "./index";

const NAMESPACES = [
  "Accordion",
  "AlertDialog",
  "Breadcrumb",
  "Dialog",
  "Drawer",
  "DropdownMenu",
  "Popover",
  "Select",
  "SidebarNav",
  "Stepper",
  "Tabs",
] as const;

describe("flat compound exports (RSC-safe)", () => {
  it("exports a flat name for every compound part", () => {
    const exports = Merid as unknown as Record<string, unknown>;
    const missing: string[] = [];
    for (const ns of NAMESPACES) {
      const parts = exports[ns] as Record<string, unknown>;
      for (const part of Object.keys(parts)) {
        if (!/^[A-Z]/.test(part)) continue;
        const flat = part === "Item" && ns === "SidebarNav" ? "SidebarNavItem" : `${ns}${part}`;
        if (exports[flat] !== parts[part]) missing.push(flat);
      }
    }
    expect(missing).toEqual([]);
  });
});
