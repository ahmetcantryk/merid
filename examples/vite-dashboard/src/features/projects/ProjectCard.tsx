import { Badge, Card, Stack, Text } from "@merid/react";
import { Globe } from "lucide-react";
import { REGIONS, STATUS_LABEL, STATUS_TONE, formatDate, formatNumber, type Project } from "../../lib/data";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card padding="md" className="project-card">
      <Stack gap={3}>
        <Stack direction="row" justify="between" align="center" gap={2}>
          <Text as="h2" size="md" weight="semibold" tone="ink" className="truncate">
            {project.name}
          </Text>
          <Badge tone={STATUS_TONE[project.status]} dot>
            {STATUS_LABEL[project.status]}
          </Badge>
        </Stack>
        <Stack direction="row" gap={2} align="center">
          <Globe size={14} aria-hidden="true" className="muted-icon" />
          <Text size="sm" tone="muted">
            {REGIONS[project.region]}
          </Text>
        </Stack>
        <Stack direction="row" justify="between">
          <Text size="xs" tone="muted" numeric>
            {formatNumber(project.requests)} req / 24h
          </Text>
          <Text size="xs" tone="muted">
            Updated {formatDate(project.updated)}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}
