"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Drawer, IconButton, SidebarNav, Stack } from "@merid/react";
import { Menu } from "lucide-react";
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
      <Drawer.Content side="right" size="sm" closeLabel="Close menu">
        <Drawer.Title>Northwind Cloud</Drawer.Title>
        <Stack gap={6} className="drawer-body">
          <SidebarNav aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <SidebarNav.Item key={l.href} as={Link} href={l.href} active={pathname.startsWith(l.href.replace(/\/1$/, ""))} onClick={close}>
                {l.label}
              </SidebarNav.Item>
            ))}
          </SidebarNav>
          <Stack gap={2}>
            <Button asChild variant="primary" fullWidth>
              <Link href="/signup" onClick={close}>Sign up</Link>
            </Button>
            <Button asChild variant="secondary" fullWidth>
              <Link href="/login" onClick={close}>Log in</Link>
            </Button>
          </Stack>
        </Stack>
      </Drawer.Content>
    </Drawer.Root>
  );
}
