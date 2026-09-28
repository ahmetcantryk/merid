"use client";

import { useState } from "react";
import { Bell, FolderKanban, Home, Inbox, Menu, Settings } from "lucide-react";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Drawer,
  DropdownMenu,
  Heading,
  IconButton,
  SidebarNav,
  Stack,
  Text,
} from "@merid/react";

const ICON = { size: 16, strokeWidth: 1.75, "aria-hidden": true } as const;
const PAGES = ["Overview", "Inbox", "Projects", "Settings"] as const;
type Page = (typeof PAGES)[number];
const ICONS: Record<Page, typeof Home> = { Overview: Home, Inbox, Projects: FolderKanban, Settings };

function Nav({ page, onNavigate }: { readonly page: Page; readonly onNavigate: (page: Page) => void }) {
  return (
    <SidebarNav aria-label="Main">
      {PAGES.map((p) => {
        const Icon = ICONS[p];
        return (
          <SidebarNav.Item
            key={p}
            href="#"
            active={p === page}
            icon={<Icon {...ICON} />}
            trailing={p === "Inbox" ? <Badge>4</Badge> : undefined}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(p);
            }}
          >
            {p}
          </SidebarNav.Item>
        );
      })}
      <SidebarNav.Group label="Pinned">
        <SidebarNav.Item href="#" onClick={(e) => e.preventDefault()}>
          Northwind
        </SidebarNav.Item>
        <SidebarNav.Item href="#" onClick={(e) => e.preventDefault()}>
          Contoso
        </SidebarNav.Item>
      </SidebarNav.Group>
    </SidebarNav>
  );
}

export function AppShellExample() {
  const [page, setPage] = useState<Page>("Overview");
  const [open, setOpen] = useState(false);
  const navigate = (p: Page) => {
    setPage(p);
    setOpen(false);
  };

  return (
    <div className="pattern-shell-frame">
    <div className="pattern-shell">
      <aside className="pattern-shell__sidebar">
        <Text weight="semibold" tone="ink" style={{ padding: "4px 8px 12px" }}>
          Northwind
        </Text>
        <Nav page={page} onNavigate={navigate} />
      </aside>
      <div className="pattern-shell__main">
        <header className="pattern-shell__topbar">
          <Stack direction="row" gap={2} align="center">
            <span className="pattern-shell__menu">
              <Drawer.Root open={open} onOpenChange={setOpen}>
                <Drawer.Trigger asChild>
                  <IconButton label="Open navigation" icon={<Menu {...ICON} />} />
                </Drawer.Trigger>
                <Drawer.Content side="left" size="sm">
                  <Drawer.Title>Northwind</Drawer.Title>
                  <div style={{ marginTop: 16 }}>
                    <Nav page={page} onNavigate={navigate} />
                  </div>
                </Drawer.Content>
              </Drawer.Root>
            </span>
            <Breadcrumb.Root>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Northwind</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Breadcrumb.Page>{page}</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.Root>
          </Stack>
          <Stack direction="row" gap={1} align="center">
            <IconButton label="Notifications" icon={<Bell {...ICON} />} />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button type="button" className="pattern-shell__avatar" aria-label="Account menu">
                  <Avatar name="Ada Lovelace" size="sm" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content placement="bottom-end">
                <DropdownMenu.Label>ada@northwind.dev</DropdownMenu.Label>
                <DropdownMenu.Item>Profile</DropdownMenu.Item>
                <DropdownMenu.Item>Settings</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Sign out</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Stack>
        </header>
        <div className="pattern-shell__content">
          <Stack gap={2}>
            <Heading level={3} size="h3">
              {page}
            </Heading>
            <Text size="sm">When the preview is narrower than 520px, the sidebar collapses into a drawer behind the menu button.</Text>
            <div>
              <Button size="sm" variant="primary">
                New project
              </Button>
            </div>
          </Stack>
        </div>
      </div>
    </div>
    </div>
  );
}
