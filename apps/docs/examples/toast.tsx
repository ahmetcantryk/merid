"use client";

import { Button, ToastProvider, useToast, type ToastTone } from "@merid/react";

function SaveButton() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({ title: "Changes saved", description: "Your workspace settings are up to date.", tone: "success" })
      }
    >
      Save changes
    </Button>
  );
}

export function ToastBasic() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}


const TONES: readonly ToastTone[] = ["neutral", "info", "success", "warning", "danger"];

function ToneButtons() {
  const { toast } = useToast();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      {TONES.map((tone) => (
        <Button key={tone} size="sm" onClick={() => toast({ title: `A ${tone} toast`, tone })}>
          {tone}
        </Button>
      ))}
    </div>
  );
}

export function ToastTones() {
  return (
    <ToastProvider>
      <ToneButtons />
    </ToastProvider>
  );
}


function ArchiveButtons() {
  const { toast, dismiss } = useToast();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      <Button
        variant="danger"
        onClick={() =>
          toast({
            id: "archive",
            title: "Project archived",
            duration: Infinity,
            action: { label: "Undo", onClick: () => toast({ title: "Project restored", tone: "success" }) },
          })
        }
      >
        Archive project
      </Button>
      <Button variant="ghost" onClick={() => dismiss()}>
        Dismiss all
      </Button>
    </div>
  );
}

export function ToastAction() {
  return (
    <ToastProvider>
      <ArchiveButtons />
    </ToastProvider>
  );
}

