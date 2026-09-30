"use client";

import { Text } from "@merid/react";

export function TextDemo() {
  return (
    <Text prose>
      Merid bölgeleri kenarlıktan önce yüzeyle ayırır, etkileşim için tek bir accent kullanır ve hiyerarşiyi ton ile
      kalınlığa bırakır.
    </Text>
  );
}

export function TextSizes() {
  return (
    <div style={{ width: "100%" }}>
      <Text size="lg">lg: giriş paragrafı, 18px</Text>
      <Text size="md">md: gövde metni, 16px</Text>
      <Text size="sm">sm: ikincil metin</Text>
      <Text size="xs">xs: yoğun arayüz metni</Text>
      <Text size="2xs">2xs: meta</Text>
      <Text size="3xs">3xs: alt yazı, 12px</Text>
    </div>
  );
}

export function TextTones() {
  return (
    <div style={{ width: "100%" }}>
      <Text tone="ink">ink: başlıklar ve güçlü metin</Text>
      <Text tone="body">body: varsayılan akan metin</Text>
      <Text tone="muted">muted: yalnızca meta</Text>
      <Text tone="accent">accent: etkileşimli vurgu</Text>
      <Text tone="danger">danger: hata metni</Text>
    </div>
  );
}

export function TextWeights() {
  return (
    <div style={{ width: "100%" }}>
      <Text weight="regular">Regular</Text>
      <Text weight="medium">Medium</Text>
      <Text weight="semibold">Semibold</Text>
    </div>
  );
}

export function TextNumeric() {
  return (
    <div>
      <Text numeric>1.204,50</Text>
      <Text numeric>987,10</Text>
      <Text as="span" size="sm" tone="muted">
        span olarak render'landı
      </Text>
    </div>
  );
}
