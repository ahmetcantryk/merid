import Link from "next/link";
import { Badge, Card, Container, Grid, Heading, Section, Stack, Text, Tooltip } from "@merid/react";
import { Activity, Globe2, Lock, Rocket } from "lucide-react";
import { buttonLinkProps } from "@/lib/button-link";

const FEATURES = [
  { icon: Rocket, title: "Deploy on push", body: "Every commit gets a preview URL. Merge to main and it ships to production in under a minute." },
  { icon: Globe2, title: "Three regions", body: "Run in Dublin, Virginia or Mumbai, with routing to the closest healthy region." },
  { icon: Activity, title: "Built-in metrics", body: "Latency, errors and saturation per service, without installing an agent." },
  { icon: Lock, title: "Secrets that stay secret", body: "Encrypted at rest, scoped per environment, rotated without a redeploy." },
];

// A server component: no "use client" here, yet Merid components render because they carry the directive.
export default function HomePage() {
  return (
    <>
      <Section>
        <Container>
          <Stack gap={6} align="start" className="hero">
            <Badge tone="accent">New: AP South region</Badge>
            <Heading level={1} size="display">Ship services, not infrastructure.</Heading>
            <Text size="lg" className="hero__lead">
              Northwind Cloud builds, deploys and scales your apps across three regions, with metrics and secrets built in.
            </Text>
            <Stack direction="row" gap={3} wrap>
              <Link href="/signup" {...buttonLinkProps("primary", "lg")}>Start free</Link>
              <Link href="/billing" {...buttonLinkProps("secondary", "lg")}>See pricing</Link>
            </Stack>
            <Text size="sm" tone="muted">
              Free for one project.{" "}
              <Tooltip content="No card required. Upgrade any time from Billing.">
                <button type="button" className="inline-hint">What is included?</button>
              </Tooltip>
            </Text>
          </Stack>
        </Container>
      </Section>
      <Section tone="tray">
        <Container>
          <Stack gap={8}>
            <Heading level={2} size="h2">Everything a small platform team would build</Heading>
            <Grid minItemWidth={240} gap={5}>
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <Card key={title} padding="lg">
                  <Stack gap={3}>
                    <span className="icon-tile" aria-hidden="true"><Icon size={18} /></span>
                    <Heading level={3} size="sm">{title}</Heading>
                    <Text size="sm" tone="muted">{body}</Text>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
    </>
  );
}
