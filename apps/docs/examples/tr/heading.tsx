"use client";

import { Heading } from "@merid/react";

export function HeadingDemo() {
  return <Heading level={2}>Daha sakin arayüzler yayınla</Heading>;
}

export function HeadingSizes() {
  return (
    <div style={{ width: "100%" }}>
      <Heading level={1}>Display</Heading>
      <Heading level={2}>Başlık h2</Heading>
      <Heading level={3}>Başlık h3</Heading>
      <Heading level={4}>Başlık lg</Heading>
      <Heading level={5}>Başlık md</Heading>
      <Heading level={6}>Başlık sm</Heading>
    </div>
  );
}

export function HeadingDecoupled() {
  return (
    <div style={{ width: "100%" }}>
      <Heading level={2} size="lg">
        Fatura geçmişi
      </Heading>
      <Heading level={3} size="sm">
        Faturalar
      </Heading>
    </div>
  );
}
