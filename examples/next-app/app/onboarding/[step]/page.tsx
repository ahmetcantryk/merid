import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card, Container, Heading, Section, Stack, StepperRoot, StepperStep, Text } from "@meridui/react";
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
// Server component, so compound parts use their flat names (StepperRoot, not Stepper.Root). The horizontal
// stepper goes compact by itself in narrow columns, so no client-side orientation switch is needed.
export default async function OnboardingStep({ params }: Props) {
  const n = parseStep((await params).step);
  if (!n) notFound();
  const step = STEPS[n - 1];
  const last = n === STEPS.length;

  return (
    <Section spacing="compact">
      <Container size="prose">
        <Stack gap={8}>
          <StepperRoot current={n - 1} aria-label="Onboarding progress">
            {STEPS.map((s) => (
              <StepperStep key={s.title} title={s.title} description={s.description} />
            ))}
          </StepperRoot>
          <Card padding="lg">
            <Stack gap={4}>
              <Text size="sm" tone="muted">Step {n} of {STEPS.length}</Text>
              <Heading level={1} size="h3">{step.title}</Heading>
              <Text>{step.body}</Text>
            </Stack>
          </Card>
          <Stack direction="row" justify="between">
            {n > 1 ? (
              <Button asChild variant="secondary">
                <Link href={`/onboarding/${n - 1}`}>Back</Link>
              </Button>
            ) : (
              <span />
            )}
            <Button asChild variant="primary">
              <Link href={last ? "/settings" : `/onboarding/${n + 1}`}>{last ? "Finish" : "Continue"}</Link>
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
