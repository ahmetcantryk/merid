"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  EmptyState,
  SegmentedControl,
  Skeleton,
  Spinner,
  Stack,
  Text,
  VisuallyHidden,
} from "@merid/react";

type View = "loading" | "empty" | "error" | "ready";

const PEOPLE = [
  { name: "Ada Lovelace", role: "Sahip" },
  { name: "Grace Hopper", role: "Yönetici" },
  { name: "Alan Turing", role: "Üye" },
];

function ListSkeleton() {
  return (
    <Stack gap={4} aria-hidden="true">
      {PEOPLE.map((p) => (
        <Stack key={p.name} direction="row" gap={3} align="center">
          <Skeleton circle width={32} height={32} />
          <Stack gap={1} style={{ flex: 1 }}>
            <Skeleton width="40%" height={12} />
            <Skeleton width="24%" height={10} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 16c.8-2.6 3.1-4 6-4s5.2 1.4 6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyLoadingStates() {
  const [view, setView] = useState<View>("loading");
  return (
    <Stack gap={4} style={{ width: "100%", maxWidth: 460 }}>
      <SegmentedControl
        aria-label="Durum"
        value={view}
        onValueChange={(v) => setView(v as View)}
        options={[
          { value: "loading", label: "Yükleniyor" },
          { value: "empty", label: "Boş" },
          { value: "error", label: "Hata" },
          { value: "ready", label: "Hazır" },
        ]}
      />
      <Card variant="outline" padding="md" aria-busy={view === "loading"} aria-live="polite">
        {view === "loading" ? (
          <>
            <VisuallyHidden>Üyeler yükleniyor…</VisuallyHidden>
            <ListSkeleton />
          </>
        ) : null}
        {view === "empty" ? (
          <EmptyState
            variant="plain"
            icon={<PeopleIcon />}
            title="Henüz üye yok"
            description="Projeleri paylaşmak ve değişiklikleri birlikte incelemek için ekip arkadaşlarını davet et."
            action={<Button variant="primary">Kişi davet et</Button>}
          />
        ) : null}
        {view === "error" ? (
          <Alert tone="danger" title="Üyeler yüklenemedi" action={<Button size="sm" onClick={() => setView("loading")}>Tekrar dene</Button>}>
            Sunucu zamanında yanıt vermedi.
          </Alert>
        ) : null}
        {view === "ready" ? (
          <Stack gap={4}>
            {PEOPLE.map((p) => (
              <Stack key={p.name} direction="row" gap={3} align="center">
                <Avatar name={p.name} size="sm" />
                <Stack gap={0}>
                  <Text size="sm" weight="medium" tone="ink">
                    {p.name}
                  </Text>
                  <Text size="xs" tone="muted">
                    {p.role}
                  </Text>
                </Stack>
              </Stack>
            ))}
          </Stack>
        ) : null}
      </Card>
    </Stack>
  );
}

export function InlineLoading() {
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!saving) return;
    const id = setTimeout(() => setSaving(false), 1500);
    return () => clearTimeout(id);
  }, [saving]);
  return (
    <Stack direction="row" gap={4} align="center">
      <Button variant="primary" loading={saving} onClick={() => setSaving(true)}>
        Değişiklikleri kaydet
      </Button>
      <Stack direction="row" gap={2} align="center">
        <Spinner size="sm" label={null} />
        <Text size="sm" tone="muted">
          3 dosya eşitleniyor…
        </Text>
      </Stack>
    </Stack>
  );
}
