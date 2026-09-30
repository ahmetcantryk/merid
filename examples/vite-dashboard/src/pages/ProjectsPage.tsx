import { useMemo, useState } from "react";
import { Button, EmptyState, Grid, Input, SegmentedControl, Select, Stack } from "@meridui/react";
import { FolderSearch, Search } from "lucide-react";
import { REGIONS, type ProjectStatus, type Region } from "../lib/data";
import { useProjects } from "../lib/projects-store";
import { hashQuery } from "../lib/router";
import { CreateProjectDialog } from "../features/projects/CreateProjectDialog";
import { ProjectCard } from "../features/projects/ProjectCard";
import { PageHeader } from "./PageHeader";

type StatusFilter = ProjectStatus | "all";
const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "healthy", label: "Healthy" },
  { value: "degraded", label: "Degraded" },
  { value: "paused", label: "Paused" },
];

export function ProjectsPage() {
  const { projects } = useProjects();
  const [query, setQuery] = useState(() => hashQuery().get("q") ?? "");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [region, setRegion] = useState<Region | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (status === "all" || p.status === status) &&
        (region === "all" || p.region === region) &&
        (!q || p.name.includes(q) || p.owner.toLowerCase().includes(q)),
    );
  }, [projects, query, status, region]);

  const reset = () => {
    setQuery("");
    setStatus("all");
    setRegion("all");
  };

  return (
    <Stack gap={7}>
      <PageHeader
        title="Projects"
        description="Every service deployed to Northwind Cloud."
        actions={<CreateProjectDialog />}
      />
      <div className="filters" role="group" aria-label="Filter projects">
        <SegmentedControl
          aria-label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
        />
        <div className="filters__region">
          <Select.Root value={region} onValueChange={(v) => setRegion(v as Region | "all")}>
            <Select.Trigger aria-label="Region" />
            <Select.Content>
              <Select.Item value="all">All regions</Select.Item>
              {Object.entries(REGIONS).map(([value, label]) => (
                <Select.Item key={value} value={value}>
                  {label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
        <div className="filters__search">
          <Input
            type="search"
            aria-label="Filter by name or owner"
            placeholder="Filter by name or owner"
            leading={<Search size={16} />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      {filtered.length ? (
        <Grid as="ul" className="plain-list" minItemWidth={260} gap={4} aria-label={`${filtered.length} projects`}>
          {filtered.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} />
            </li>
          ))}
        </Grid>
      ) : (
        <EmptyState
          icon={<FolderSearch size={20} />}
          title="No projects match these filters"
          description="Try another status or region, or clear the search."
          action={<Button onClick={reset}>Clear filters</Button>}
        />
      )}
    </Stack>
  );
}
