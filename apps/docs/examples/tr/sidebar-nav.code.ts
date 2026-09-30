// Doküman kod sekmelerinde gösterilen kaynak metinler. Server component'ler okuyabilsin diye client modülünün dışında tutulur.

export const sidebarNavBasicCode = `import { Badge, SidebarNav } from "@meridui/react";

export function Example() {
  return (
    <SidebarNav aria-label="Çalışma alanı">
      <SidebarNav.Item href="#" icon={<Icon />} active>
        Genel bakış
      </SidebarNav.Item>
      <SidebarNav.Item href="#" icon={<Icon />} trailing={<Badge>12</Badge>}>
        Gelen kutusu
      </SidebarNav.Item>
      <SidebarNav.Group label="Projeler">
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
    <SidebarNav aria-label="Ana menü">
      <SidebarNav.Item as={Link} href="/settings" active={pathname === "/settings"}>
        Ayarlar
      </SidebarNav.Item>
    </SidebarNav>
  );
}`;
