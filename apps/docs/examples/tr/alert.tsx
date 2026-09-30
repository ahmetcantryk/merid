"use client";

import { useState } from "react";
import { Alert, Button, IconButton } from "@merid/react";
import { CloseIcon } from "../icons";

const wrap = { width: "100%", maxWidth: 560, display: "grid", gap: 12 } as const;

export function AlertDemo() {
  return (
    <div style={wrap}>
      <Alert title="Yeni sürüm hazır">En son özellikleri almak için sayfayı yenile.</Alert>
    </div>
  );
}

export function AlertTones() {
  return (
    <div style={wrap}>
      <Alert tone="info" title="Bilgin olsun">Bakım pazar günü 02:00 UTC'de yapılacak.</Alert>
      <Alert tone="success" title="Ödeme alındı">Faturan ödendi olarak işaretlendi.</Alert>
      <Alert tone="warning" title="Depolama alanı dolmak üzere">Kotanın %92'sini kullandın.</Alert>
      <Alert tone="danger" title="Senkronizasyon başarısız">Sunucuya ulaşılamadı. Bağlantını kontrol et.</Alert>
    </div>
  );
}

export function AlertAction() {
  const [open, setOpen] = useState(true);
  return (
    <div style={wrap}>
      {open ? (
        <Alert
          tone="warning"
          title="Deneme süren 3 gün sonra bitiyor"
          action={
            <IconButton size="sm" label="Kapat" icon={<CloseIcon />} onClick={() => setOpen(false)} />
          }
        >
          Çalışma alanını kaybetmemek için bir ödeme yöntemi ekle.
        </Alert>
      ) : (
        <Button onClick={() => setOpen(true)}>Uyarıyı göster</Button>
      )}
      <Alert tone="info" action={<Button size="sm">İncele</Button>}>
        2 üye onay bekliyor.
      </Alert>
    </div>
  );
}

export function AlertNoIcon() {
  return (
    <div style={wrap}>
      <Alert icon={null} live="off">
        İkonu ve live region'ı olmayan sade bir not.
      </Alert>
    </div>
  );
}
