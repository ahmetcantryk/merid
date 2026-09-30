"use client";

import { Button, EmptyState } from "@merid/react";
import { InboxIcon, PlusIcon, SearchIcon } from "../icons";

const wrap = { width: "100%", maxWidth: 560 } as const;

export function EmptyStateDemo() {
  return (
    <div style={wrap}>
      <EmptyState
        icon={<InboxIcon />}
        title="Henüz fatura yok"
        description="Oluşturduğun ya da aldığın faturalar burada görünür."
        action={
          <Button variant="primary" leadingIcon={<PlusIcon />}>
            Yeni fatura
          </Button>
        }
      />
    </div>
  );
}

export function EmptyStatePlain() {
  return (
    <div style={wrap}>
      <EmptyState
        variant="plain"
        icon={<SearchIcon />}
        title="“çeyreklik” için sonuç yok"
        description="Daha kısa bir arama dene ya da yazımı kontrol et."
        action={<Button>Aramayı temizle</Button>}
        titleLevel={2}
      />
    </div>
  );
}

export function EmptyStateMinimal() {
  return (
    <div style={wrap}>
      <EmptyState title="İncelenecek bir şey yok" />
    </div>
  );
}
