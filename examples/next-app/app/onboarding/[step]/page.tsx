import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, Container, Heading, Section, Stack, Text } from "@merid/react";
import { buttonLinkProps } from "@/lib/button-link";
import { OnboardingStepper } from "@/components/OnboardingStepper";
import { STEPS } from "@/lib/onboarding";

interface Props { params: Promise<{ step: string }> }

function parseStep(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= STEPS.length ? n : null;
}

export function generateStaticParams() {
  return STEPS.map((_, i) => ({ step: String(i + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parseStep((await params).step);
  return { title: n ? `Onboarding: ${STEPS[n - 1].title}` : "Onboarding" };
}

// Fully server-rendered wizard: each step is a URL, so Back/refresh/share all work.
export default async function OnboardingStep({ params }: Props) {
  const n = parseStep((await params).step);
  if (!n) notFound();
  const step = STEPS[n - 1];
  const last = n === STEPS.length;

  return (
    <Section spacing="compact">
      <Container size="prose">
        <Stack gap={8}>
          <OnboardingStepper current={n - 1} />
          <Card padding="lg">
            <Stack gap={4}>
              <Text size="sm" tone="muted">Step {n} of {STEPS.length}</Text>
              <Heading level={1} size="h3">{step.title}</Heading>
              <Text>{step.body}</Text>
            </Stack>
          </Card>
          <Stack direction="row" justify="between">
            {n > 1 ? <Link href={`/onboarding/${n - 1}`} {...buttonLinkProps("secondary")}>Back</Link> : <span />}
            <Link href={last ? "/settings" : `/onboarding/${n + 1}`} {...buttonLinkProps("primary")}>
              {last ? "Finish" : "Continue"}
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
