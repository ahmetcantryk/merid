"use client";

import { Button, ToastProvider, useToast, type ToastTone } from "@meridui/react";

function SaveButton() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({ title: "Değişiklikler kaydedildi", description: "Çalışma alanı ayarların güncel.", tone: "success" })
      }
    >
      Değişiklikleri kaydet
    </Button>
  );
}

export function ToastBasic() {
  return (
    <ToastProvider label="Bildirimler">
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
        <Button key={tone} size="sm" onClick={() => toast({ title: `${tone} tonunda bir toast`, tone })}>
          {tone}
        </Button>
      ))}
    </div>
  );
}

export function ToastTones() {
  return (
    <ToastProvider label="Bildirimler">
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
            title: "Proje arşivlendi",
            duration: Infinity,
            action: { label: "Geri al", onClick: () => toast({ title: "Proje geri yüklendi", tone: "success" }) },
          })
        }
      >
        Projeyi arşivle
      </Button>
      <Button variant="ghost" onClick={() => dismiss()}>
        Tümünü kapat
      </Button>
    </div>
  );
}

export function ToastAction() {
  return (
    <ToastProvider label="Bildirimler">
      <ArchiveButtons />
    </ToastProvider>
  );
}
