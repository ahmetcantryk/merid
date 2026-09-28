import { Badge, Card, Grid, Text } from "@merid/react";
import { formatNumber } from "../../lib/data";
import { useProjects } from "../../lib/projects-store";

export function StatTiles() {
  const { projects } = useProjects();
  const requests = projects.reduce((sum, p) => sum + p.requests, 0);
  const degraded = projects.filter((p) => p.status === "degraded").length;

  const tiles = [
    { label: "Requests (24h)", value: formatNumber(requests), delta: "+12.4%", tone: "success" as const },
    { label: "Active projects", value: String(projects.filter((p) => p.status !== "paused").length), delta: `${projects.length} total`, tone: "neutral" as const },
    { label: "p95 latency", value: "182 ms", delta: "−8 ms", tone: "success" as const },
    { label: "Degraded", value: String(degraded), delta: degraded ? "Needs attention" : "All clear", tone: degraded ? ("warning" as const) : ("success" as const) },
  ];

  return (
    <Grid minItemWidth={200} gap={4} as="ul" className="plain-list" aria-label="Key metrics">
      {tiles.map((tile) => (
        <Card as="li" key={tile.label} padding="md" className="stat">
          <Text size="sm" tone="muted">{tile.label}</Text>
          <Text as="p" size="lg" weight="semibold" tone="ink" numeric className="stat__value">{tile.value}</Text>
          <Badge tone={tile.tone}>{tile.delta}</Badge>
        </Card>
      ))}
    </Grid>
  );
}
