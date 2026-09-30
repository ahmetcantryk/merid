"use client";

import { Badge } from "@merid/react";

export function BadgeDemo() {
  return (
    <Badge tone="success" dot>
      Aktif
    </Badge>
  );
}

export function BadgeTones() {
  return (
    <>
      <Badge>Nötr</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="success">Başarılı</Badge>
      <Badge tone="warning">Uyarı</Badge>
      <Badge tone="danger">Hata</Badge>
      <Badge tone="solid">Dolgulu</Badge>
    </>
  );
}

export function BadgeDots() {
  return (
    <>
      <Badge tone="success" dot>Çevrimiçi</Badge>
      <Badge tone="warning" dot>Yavaşladı</Badge>
      <Badge tone="danger" dot>Erişilemiyor</Badge>
    </>
  );
}

export function BadgeCount() {
  return <Badge tone="accent">12</Badge>;
}
