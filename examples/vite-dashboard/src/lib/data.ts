export type ProjectStatus = "healthy" | "degraded" | "paused";
export type Region = "eu-west" | "us-east" | "ap-south";

export interface Project {
  id: string;
  name: string;
  owner: string;
  region: Region;
  status: ProjectStatus;
  requests: number;
  updated: string;
}

export const REGIONS: Record<Region, string> = {
  "eu-west": "EU West (Dublin)",
  "us-east": "US East (Virginia)",
  "ap-south": "AP South (Mumbai)",
};

export const STATUS_TONE = {
  healthy: "success",
  degraded: "warning",
  paused: "neutral",
} as const;

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  paused: "Paused",
};

const NAMES = [
  "checkout-api", "billing-worker", "search-index", "auth-gateway", "media-resizer",
  "ledger-sync", "notifications", "reports-cron", "catalog-edge", "inventory-feed",
  "support-bot", "audit-trail", "geo-router", "pricing-engine", "session-store",
  "email-relay", "webhooks-out", "metrics-agg", "cdn-purger", "status-page",
  "orders-queue", "ml-scoring", "backup-runner",
];
const OWNERS = ["Mara Lindqvist", "Tomas Reyes", "Aiko Tanaka", "Priya Nair", "Jonah Weiss"];
const REGION_KEYS = Object.keys(REGIONS) as Region[];
const STATUSES: ProjectStatus[] = ["healthy", "healthy", "healthy", "degraded", "paused"];

export const INITIAL_PROJECTS: Project[] = NAMES.map((name, i) => ({
  id: `prj_${(1000 + i * 37).toString(36)}`,
  name,
  owner: OWNERS[i % OWNERS.length],
  region: REGION_KEYS[i % REGION_KEYS.length],
  status: STATUSES[(i * 3) % STATUSES.length],
  requests: Math.round(((i * 7919) % 97) * 1370 + 2400),
  updated: new Date(Date.UTC(2026, 8, 27 - (i % 14), 9 + (i % 8))).toISOString(),
}));

export const MEMBERS = [
  { name: "Mara Lindqvist", email: "mara@northwind.example", role: "Owner" },
  { name: "Tomas Reyes", email: "tomas@northwind.example", role: "Admin" },
  { name: "Aiko Tanaka", email: "aiko@northwind.example", role: "Developer" },
  { name: "Priya Nair", email: "priya@northwind.example", role: "Developer" },
  { name: "Jonah Weiss", email: "jonah@northwind.example", role: "Viewer" },
];

const numberFormat = new Intl.NumberFormat("en-US");
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export const formatNumber = (n: number) => numberFormat.format(n);
export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
