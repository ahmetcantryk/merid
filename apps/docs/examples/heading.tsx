"use client";

import { Heading } from "@meridui/react";

export function HeadingDemo() {
  return <Heading level={2}>Ship calmer interfaces</Heading>;
}

export function HeadingSizes() {
  return (
    <div style={{ width: "100%" }}>
      <Heading level={1}>Display</Heading>
      <Heading level={2}>Heading h2</Heading>
      <Heading level={3}>Heading h3</Heading>
      <Heading level={4}>Heading lg</Heading>
      <Heading level={5}>Heading md</Heading>
      <Heading level={6}>Heading sm</Heading>
    </div>
  );
}

export function HeadingDecoupled() {
  return (
    <div style={{ width: "100%" }}>
      <Heading level={2} size="lg">
        Billing history
      </Heading>
      <Heading level={3} size="sm">
        Invoices
      </Heading>
    </div>
  );
}
