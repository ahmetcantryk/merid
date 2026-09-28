"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer, IconButton, SidebarNav, Stack } from "@merid/react";
import { Menu } from "lucide-react";
import { buttonLinkProps } from "@/lib/button-link";
import { NAV_LINKS } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <IconButton className="show-sm" label="Open menu" icon={<Menu size={18} />} />
      </Drawer.Trigger>
      <Drawer.Content side="right" size="sm">
        <Drawer.Title>Northwind Cloud</Drawer.Title>
        <Drawer.Close icon aria-label="Close menu" />
        <Stack gap={6} className="drawer-body">
          <SidebarNav aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <SidebarNav.Item key={l.href} as={Link} href={l.href} active={pathname.startsWith(l.href.replace(/\/1$/, ""))} onClick={close}>
                {l.label}
              </SidebarNav.Item>
            ))}
          </SidebarNav>
          <Stack gap={2}>
            <Link href="/signup" {...buttonLinkProps("primary")} data-full-width="" onClick={close}>Sign up</Link>
            <Link href="/login" {...buttonLinkProps("secondary")} data-full-width="" onClick={close}>Log in</Link>
          </Stack>
        </Stack>
      </Drawer.Content>
    </Drawer.Root>
  );
}
