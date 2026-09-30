// Source strings shown in the docs code tabs. Kept out of the client module so server components can read them.

export const sidebarNavBasicCode = `import { Badge, SidebarNav } from "@meridui/react";

export function Example() {
  return (
    <SidebarNav aria-label="Workspace">
      <SidebarNav.Item href="#" icon={<Icon />} active>
        Overview
      </SidebarNav.Item>
      <SidebarNav.Item href="#" icon={<Icon />} trailing={<Badge>12</Badge>}>
        Inbox
      </SidebarNav.Item>
      <SidebarNav.Group label="Projects">
        <SidebarNav.Item href="#">Northwind</SidebarNav.Item>
        <SidebarNav.Item href="#">Contoso</SidebarNav.Item>
      </SidebarNav.Group>
    </SidebarNav>
  );
}`;


export const sidebarNavRouterCode = `import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNav } from "@meridui/react";

export function AppNav() {
  const pathname = usePathname();
  return (
    <SidebarNav aria-label="Main">
      <SidebarNav.Item as={Link} href="/settings" active={pathname === "/settings"}>
        Settings
      </SidebarNav.Item>
    </SidebarNav>
  );
}`;
