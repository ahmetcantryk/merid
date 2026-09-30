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
        <Text size="sm">Proje silindi.</Text>
        <Button size="sm" onClick={() => setDeleted(false)}>
          Demoyu sıfırla
        </Button>
      </Stack>
    );
  }

  return (
    <AlertDialog.Root onOpenChange={(open) => !open && setTyped("")}>
      <AlertDialog.Trigger asChild>
        <Button variant="danger">Projeyi sil</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>“{PROJECT}” silinsin mi?</AlertDialog.Title>
        <AlertDialog.Description>
          24 deployment, 3 alan adı ve tüm ortam değişkenleri silinir. Bu işlem geri alınamaz.
        </AlertDialog.Description>
        <div style={{ marginTop: 16 }}>
          <Field label={`Onaylamak için ${PROJECT} yaz`}>
            <Input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
          </Field>
        </div>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Vazgeç</AlertDialog.Cancel>
          <AlertDialog.Action
            tone="danger"
            disabled={!matches}
            onClick={() => {
              setDeleted(true);
              toast({ title: "Proje silindi", tone: "danger" });
            }}
          >
            Projeyi sil
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
          title: "Proje arşivlendi",
          description: "Artık panelde görünmüyor.",
          duration: 8000,
          action: { label: "Geri al", onClick: () => setArchived(false) },
        });
      }}
    >
      {archived ? "Arşivlendi" : "Projeyi arşivle"}
    </Button>
  );
}

export function ConfirmTyped() {
  return (
    <ToastProvider label="Bildirimler">
      <TypedConfirm />
    </ToastProvider>
  );
}

export function ConfirmUndo() {
  return (
    <ToastProvider label="Bildirimler">
      <UndoArchive />
    </ToastProvider>
  );
}
