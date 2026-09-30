"use client";

import { Badge, SidebarNav } from "@merid/react";

function Icon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function SidebarNavBasic() {
  return (
    <div style={{ width: 240, maxWidth: "100%" }}>
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
    </div>
  );
}
