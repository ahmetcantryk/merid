import { useState } from "react";
import { AlertDialog, Button, Card, Field, Heading, Input, Separator, Stack, Switch, Text, useToast } from "@meridui/react";

const PREFERENCES = [
  { id: "deploys", label: "Deployment emails", description: "A summary after every production deploy." },
  { id: "incidents", label: "Incident alerts", description: "Page me when a project I own degrades." },
  { id: "digest", label: "Weekly usage digest", description: "Sent on Mondays at 09:00 UTC." },
] as const;

type PreferenceId = (typeof PREFERENCES)[number]["id"];

export function GeneralTab() {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<Record<PreferenceId, boolean>>({ deploys: true, incidents: true, digest: false });
  const [workspace, setWorkspace] = useState("Northwind Cloud");

  const setPref = (id: PreferenceId, value: boolean) => {
    setPrefs((current) => ({ ...current, [id]: value }));
    toast({ title: value ? "Notification enabled" : "Notification disabled", duration: 2500 });
  };

  return (
    <Stack gap={6}>
      <Card padding="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast({ tone: "success", title: "Workspace saved" });
          }}
        >
          <Stack gap={4}>
            <Heading level={2} size="sm">Workspace</Heading>
            <Field label="Workspace name" description="Shown in invites and on invoices.">
              <Input value={workspace} onChange={(e) => setWorkspace(e.target.value)} maxLength={48} />
            </Field>
            <div>
              <Button type="submit" variant="primary" disabled={!workspace.trim()}>Save</Button>
            </div>
          </Stack>
        </form>
      </Card>

      <Card padding="lg">
        <Stack gap={4}>
          <Heading level={2} size="sm">Notifications</Heading>
          {PREFERENCES.map((pref, i) => (
            <Stack gap={4} key={pref.id}>
              {i > 0 ? <Separator /> : null}
              <div className="pref-row">
                <Stack gap={1}>
                  <Text size="sm" weight="medium" tone="ink" id={`pref-${pref.id}`}>{pref.label}</Text>
                  <Text size="sm" tone="muted" id={`pref-${pref.id}-desc`}>{pref.description}</Text>
                </Stack>
                <Switch
                  aria-labelledby={`pref-${pref.id}`}
                  aria-describedby={`pref-${pref.id}-desc`}
                  checked={prefs[pref.id]}
                  onCheckedChange={(value) => setPref(pref.id, value)}
                />
              </div>
            </Stack>
          ))}
        </Stack>
      </Card>

      <DangerZone />
    </Stack>
  );
}

function DangerZone() {
  const { toast } = useToast();
  return (
    <Card padding="lg" variant="outline" className="danger-zone">
      <div className="pref-row">
        <Stack gap={1}>
          <Heading level={2} size="sm">Delete workspace</Heading>
          <Text size="sm" tone="muted">Removes every project, secret and invoice record. This cannot be undone.</Text>
        </Stack>
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <Button variant="danger">Delete workspace</Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Title>Delete Northwind Cloud?</AlertDialog.Title>
            <AlertDialog.Description>
              All 23 projects stop serving traffic immediately and their data is purged after 24 hours.
            </AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Keep workspace</AlertDialog.Cancel>
              <AlertDialog.Action
                tone="danger"
                onClick={() => toast({ tone: "danger", title: "Deletion scheduled", description: "Demo only: nothing was deleted." })}
              >
                Delete workspace
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </div>
    </Card>
  );
}
