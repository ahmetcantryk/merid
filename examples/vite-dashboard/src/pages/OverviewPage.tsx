import { Card, EmptyState, Grid, Heading, Stack, Text } from "@merid/react";
import { ShieldCheck } from "lucide-react";
import { DeploymentsTable } from "../features/overview/DeploymentsTable";
import { StatTiles } from "../features/overview/StatTiles";
import { UsageMeters } from "../features/overview/UsageMeters";
import { PageHeader } from "./PageHeader";

export function OverviewPage() {
  return (
    <Stack gap={8}>
      <PageHeader title="Overview" description="Traffic, usage and project health across your workspace." />
      <StatTiles />
      <Grid minItemWidth={320} gap={5}>
        <UsageMeters />
        <Card padding="lg">
          <Stack gap={4}>
            <Heading level={2} size="sm">Incidents</Heading>
            <EmptyState
              variant="plain"
              titleLevel={3}
              icon={<ShieldCheck size={20} />}
              title="No open incidents"
              description="We will page the on-call rotation if a project degrades for more than five minutes."
            />
          </Stack>
        </Card>
      </Grid>
      <Stack gap={4}>
        <Stack gap={1}>
          <Heading level={2} size="lg">Projects</Heading>
          <Text size="sm" tone="muted">Select rows to pause or archive several projects at once.</Text>
        </Stack>
        <DeploymentsTable />
      </Stack>
    </Stack>
  );
}
