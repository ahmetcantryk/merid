"use client";

import { useState } from "react";
import { AlertDialog, Button, Field, Input, Stack, Text, ToastProvider, useToast } from "@merid/react";

const PROJECT = "northwind";

function TypedConfirm() {
  const [typed, setTyped] = useState("");
  const [deleted, setDeleted] = useState(false);
  const { toast } = useToast();
  const matches = typed === PROJECT;

  if (deleted) {
    return (
      <Stack gap={2} align="center">
        <Text size="sm">The project was deleted.</Text>
        <Button size="sm" onClick={() => setDeleted(false)}>
          Reset demo
        </Button>
      </Stack>
    );
  }

  return (
    <AlertDialog.Root onOpenChange={(open) => !open && setTyped("")}>
      <AlertDialog.Trigger asChild>
        <Button variant="danger">Delete project</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete “{PROJECT}”?</AlertDialog.Title>
        <AlertDialog.Description>
          This removes 24 deployments, 3 domains and all environment variables. It cannot be undone.
        </AlertDialog.Description>
        <div style={{ marginTop: 16 }}>
          <Field label={`Type ${PROJECT} to confirm`}>
            <Input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
          </Field>
        </div>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action
            tone="danger"
            disabled={!matches}
            onClick={() => {
              setDeleted(true);
              toast({ title: "Project deleted", tone: "danger" });
            }}
          >
            Delete project
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

function UndoArchive() {
  const { toast } = useToast();
  const [archived, setArchived] = useState(false);
  return (
    <Button
      disabled={archived}
      onClick={() => {
        setArchived(true);
        toast({
          id: "archive",
          title: "Project archived",
          description: "It is hidden from the dashboard.",
          duration: 8000,
          action: { label: "Undo", onClick: () => setArchived(false) },
        });
      }}
    >
      {archived ? "Archived" : "Archive project"}
    </Button>
  );
}

export function ConfirmTyped() {
  return (
    <ToastProvider>
      <TypedConfirm />
    </ToastProvider>
  );
}

export function ConfirmUndo() {
  return (
    <ToastProvider>
      <UndoArchive />
    </ToastProvider>
  );
}
