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
} from "@meridui/react";

type View = "loading" | "empty" | "error" | "ready";

const PEOPLE = [
  { name: "Ada Lovelace", role: "Owner" },
  { name: "Grace Hopper", role: "Admin" },
  { name: "Alan Turing", role: "Member" },
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
        aria-label="State"
        value={view}
        onValueChange={(v) => setView(v as View)}
        options={[
          { value: "loading", label: "Loading" },
          { value: "empty", label: "Empty" },
          { value: "error", label: "Error" },
          { value: "ready", label: "Ready" },
        ]}
      />
      <Card variant="outline" padding="md" aria-busy={view === "loading"} aria-live="polite">
        {view === "loading" ? (
          <>
            <VisuallyHidden>Loading members…</VisuallyHidden>
            <ListSkeleton />
          </>
        ) : null}
        {view === "empty" ? (
          <EmptyState
            variant="plain"
            icon={<PeopleIcon />}
            title="No members yet"
            description="Invite teammates to share projects and review changes together."
            action={<Button variant="primary">Invite people</Button>}
          />
        ) : null}
        {view === "error" ? (
          <Alert tone="danger" title="Members could not be loaded" action={<Button size="sm" onClick={() => setView("loading")}>Retry</Button>}>
            The server took too long to respond.
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
        Save changes
      </Button>
      <Stack direction="row" gap={2} align="center">
        <Spinner size="sm" label={null} />
        <Text size="sm" tone="muted">
          Syncing 3 files…
        </Text>
      </Stack>
    </Stack>
  );
}
