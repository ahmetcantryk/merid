"use client";

import { ArrowRight, Download, Mail, MoreHorizontal, Plus, Search, Settings, Trash2 } from "lucide-react";
import { Alert, Badge, Button, IconButton, Input, SidebarNav, Stack } from "@merid/react";

/** Merid'in kontrol ölçeği: butonlarda ve nav satırlarında 16px, kompakt input'larda ve badge'lerde 14px. */
const ICON = { size: 16, strokeWidth: 1.75, "aria-hidden": true } as const;
const ICON_SM = { size: 14, strokeWidth: 1.75, "aria-hidden": true } as const;

export function IconsInControls() {
  return (
    <Stack gap={4} style={{ width: "100%", maxWidth: 440 }}>
      <Stack direction="row" gap={2} wrap align="center">
        <Button variant="primary" leadingIcon={<Plus {...ICON} />}>
          Yeni proje
        </Button>
        <Button trailingIcon={<ArrowRight {...ICON} />}>Devam et</Button>
        <Button variant="ghost" leadingIcon={<Download {...ICON} />}>
          Dışa aktar
        </Button>
      </Stack>
      <Stack direction="row" gap={1} align="center">
        <IconButton label="Ayarlar" icon={<Settings {...ICON} />} />
        <IconButton label="Diğer işlemler" icon={<MoreHorizontal {...ICON} />} variant="secondary" />
        <IconButton label="Sil" icon={<Trash2 {...ICON} />} />
      </Stack>
      <Input leading={<Search {...ICON_SM} />} placeholder="Projelerde ara" aria-label="Projelerde ara" />
      <Stack direction="row" gap={2} align="center">
        <Badge tone="accent">
          <Mail {...ICON_SM} style={{ marginInlineEnd: 4 }} />
          Davet edildi
        </Badge>
      </Stack>
      <div style={{ width: 220 }}>
        <SidebarNav aria-label="İkon örneği">
          <SidebarNav.Item href="#" icon={<Mail {...ICON} />} active>
            Gelen kutusu
          </SidebarNav.Item>
          <SidebarNav.Item href="#" icon={<Settings {...ICON} />}>
            Ayarlar
          </SidebarNav.Item>
        </SidebarNav>
      </div>
      <Alert tone="info" title="Özel alert ikonu" icon={<Mail size={16} strokeWidth={1.75} />}>
        <code>icon</code> prop'una herhangi bir node ver; gizlemek için <code>null</code> ver.
      </Alert>
    </Stack>
  );
}
