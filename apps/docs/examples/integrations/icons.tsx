"use client";

import { ArrowRight, Download, Mail, MoreHorizontal, Plus, Search, Settings, Trash2 } from "lucide-react";
import { Alert, Badge, Button, IconButton, Input, SidebarNav, Stack } from "@merid/react";

/** Merid's control scale: 16px in buttons and nav rows, 14px inside compact inputs and badges. */
const ICON = { size: 16, strokeWidth: 1.75, "aria-hidden": true } as const;
const ICON_SM = { size: 14, strokeWidth: 1.75, "aria-hidden": true } as const;

export function IconsInControls() {
  return (
    <Stack gap={4} style={{ width: "100%", maxWidth: 440 }}>
      <Stack direction="row" gap={2} wrap align="center">
        <Button variant="primary" leadingIcon={<Plus {...ICON} />}>
          New project
        </Button>
        <Button trailingIcon={<ArrowRight {...ICON} />}>Continue</Button>
        <Button variant="ghost" leadingIcon={<Download {...ICON} />}>
          Export
        </Button>
      </Stack>
      <Stack direction="row" gap={1} align="center">
        <IconButton label="Settings" icon={<Settings {...ICON} />} />
        <IconButton label="More actions" icon={<MoreHorizontal {...ICON} />} variant="secondary" />
        <IconButton label="Delete" icon={<Trash2 {...ICON} />} />
      </Stack>
      <Input leading={<Search {...ICON_SM} />} placeholder="Search projects" aria-label="Search projects" />
      <Stack direction="row" gap={2} align="center">
        <Badge tone="accent">
          <Mail {...ICON_SM} style={{ marginInlineEnd: 4 }} />
          Invited
        </Badge>
      </Stack>
      <div style={{ width: 220 }}>
        <SidebarNav aria-label="Icon example">
          <SidebarNav.Item href="#" icon={<Mail {...ICON} />} active>
            Inbox
          </SidebarNav.Item>
          <SidebarNav.Item href="#" icon={<Settings {...ICON} />}>
            Settings
          </SidebarNav.Item>
        </SidebarNav>
      </div>
      <Alert tone="info" title="Custom alert icon" icon={<Mail size={16} strokeWidth={1.75} />}>
        Pass any node to <code>icon</code>, or <code>null</code> to hide it.
      </Alert>
    </Stack>
  );
}
