import type { Metadata } from "next";
import { Container, Heading, Section, Stack, Text } from "@merid/react";
import { PlanPicker } from "./PlanPicker";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <Section spacing="compact">
      <Container>
        <Stack gap={8}>
          <Stack gap={2}>
            <Heading level={1} size="h2">Plans and billing</Heading>
            <Text tone="muted">Switch plans at any time. Changes are prorated to the day.</Text>
          </Stack>
          <PlanPicker initialPlan="team" />
        </Stack>
      </Container>
    </Section>
  );
}
