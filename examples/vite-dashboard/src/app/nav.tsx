import { SidebarNav } from "@meridui/react";
import { FolderKanban, LayoutDashboard, Settings } from "lucide-react";
import { hrefFor, type Route } from "../lib/router";

const ITEMS: { route: Route; label: string; icon: React.ReactNode }[] = [
  { route: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { route: "projects", label: "Projects", icon: <FolderKanban size={16} /> },
  { route: "settings", label: "Settings", icon: <Settings size={16} /> },
];

export function AppNav({ route, onNavigate }: { route: Route; onNavigate?: () => void }) {
  return (
    <SidebarNav aria-label="Main">
      <SidebarNav.Group label="Workspace">
        {ITEMS.map((item) => (
          <SidebarNav.Item
            key={item.route}
            href={hrefFor(item.route)}
            icon={item.icon}
            active={item.route === route}
            onClick={onNavigate}
          >
            {item.label}
          </SidebarNav.Item>
        ))}
      </SidebarNav.Group>
    </SidebarNav>
  );
}
