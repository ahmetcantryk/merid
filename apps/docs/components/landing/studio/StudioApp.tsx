"use client";

import { useId } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  NativeSelect,
  SidebarNav,
  SidebarNavItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  type BadgeTone,
} from "@meridui/react";
import type { Dictionary } from "@/lib/i18n";

type Strings = Dictionary["playground"];
export type EnvTab = "all" | "production" | "preview";
type Status = "ready" | "building" | "failed" | "queued";

export interface AppState {
  readonly tab: EnvTab;
  readonly projectName: string;
  readonly region: string;
  readonly deployOnPush: boolean;
  readonly requireReview: boolean;
}

export const INITIAL_APP: AppState = {
  tab: "all",
  projectName: "northwind-web",
  region: "eu",
  deployOnPush: true,
  requireReview: false,
};

const ROWS = [
  { sha: "a41f9c2", message: "Fix focus ring on menus", branch: "main", env: "production", status: "ready", age: 2 },
  { sha: "c09e6b3", message: "Docs: RTL guide", branch: "docs/rtl", env: "preview", status: "queued", age: 1 },
  { sha: "9b07e11", message: "Annual billing plans", branch: "feat/billing-v2", env: "preview", status: "building", age: 6 },
  { sha: "e3c5d80", message: "Upgrade @meridui/react", branch: "main", env: "production", status: "ready", age: 95 },
  { sha: "71d2a4f", message: "Sort indicators in tables", branch: "feat/sorting", env: "preview", status: "failed", age: 180 },
] as const satisfies readonly { sha: string; message: string; branch: string; env: Exclude<EnvTab, "all">; status: Status; age: number }[];

const TONE: Record<Status, BadgeTone> = { ready: "success", building: "accent", failed: "danger", queued: "neutral" };

interface StudioAppProps {
  readonly t: Strings;
  readonly state: AppState;
  readonly onChange: (next: AppState) => void;
  /** A visual copy for the dark half of split mode: hidden from assistive tech and not interactive. */
  readonly mirror?: boolean;
}

/** The dashboard in the preview window: every part is a stock @meridui/react component. */
export function StudioApp({ t, state, onChange, mirror = false }: StudioAppProps) {
  const dialogTitle = useId();
  const rows = ROWS.filter((r) => state.tab === "all" || r.env === state.tab);
  const set = (patch: Partial<AppState>) => onChange({ ...state, ...patch });

  return (
    <div className="studio-app" aria-hidden={mirror || undefined} inert={mirror || undefined}>
      <aside className="studio-app__side">
        <div className="studio-app__workspace">
          <Avatar name={t.workspace} size="sm" />
          <span>{t.workspace}</span>
        </div>
        <SidebarNav aria-label={t.navLabel}>
          <SidebarNavItem as="button" type="button">{t.nav.overview}</SidebarNavItem>
          <SidebarNav.Group label={t.navGroup}>
            <SidebarNav.Item as="button" type="button" active trailing={<Badge tone="neutral">{ROWS.length}</Badge>}>
              {t.nav.deployments}
            </SidebarNav.Item>
            <SidebarNav.Item as="button" type="button">{t.nav.domains}</SidebarNav.Item>
            <SidebarNav.Item as="button" type="button">{t.nav.members}</SidebarNav.Item>
            <SidebarNav.Item as="button" type="button">{t.nav.settings}</SidebarNav.Item>
          </SidebarNav.Group>
        </SidebarNav>
      </aside>

      <div className="studio-app__main">
        <header className="studio-app__head">
          <div>
            <p className="studio-app__title">{t.pageTitle}</p>
            <p className="studio-app__meta">{state.projectName || "—"} · eu-central</p>
          </div>
          <Button variant="primary">{t.newDeploy}</Button>
        </header>

        <Tabs.Root value={state.tab} onValueChange={(v) => set({ tab: v as EnvTab })}>
          <Tabs.List aria-label={t.filterLabel}>
            <Tabs.Trigger value="all">{t.tabs.all}</Tabs.Trigger>
            <Tabs.Trigger value="production">{t.tabs.production}</Tabs.Trigger>
            <Tabs.Trigger value="preview">{t.tabs.preview}</Tabs.Trigger>
          </Tabs.List>
          {(["all", "production", "preview"] as const).map((tab) => (
            <Tabs.Panel key={tab} value={tab} className="studio-app__panel">
              {tab === state.tab ? (
                <Table density="sm" aria-label={t.tableLabel}>
                  <TableHead>
                    <TableRow>
                      <TableHeader>{t.columns.commit}</TableHeader>
                      <TableHeader>{t.columns.status}</TableHeader>
                      <TableHeader className="studio-app__col-branch">{t.columns.branch}</TableHeader>
                      <TableHeader align="end">{t.columns.age}</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.sha}>
                        <TableCell>
                          <span className="studio-app__sha">{r.sha}</span> {r.message}
                        </TableCell>
                        <TableCell>
                          <Badge tone={TONE[r.status]} dot>
                            {t.statuses[r.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="studio-app__col-branch">
                          <span className="studio-app__branch">{r.branch}</span>
                        </TableCell>
                        <TableCell align="end">{t.ago(r.age)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
            </Tabs.Panel>
          ))}
        </Tabs.Root>

        <div className="studio-app__lower">
          <Card padding="none" className="studio-app__form">
            <p className="studio-app__card-title">{t.formTitle}</p>
            <div className="studio-app__fields">
              <Field label={t.projectName}>
                <Input value={state.projectName} onChange={(e) => set({ projectName: e.target.value })} />
              </Field>
              <Field label={t.region}>
                <NativeSelect value={state.region} onChange={(e) => set({ region: e.target.value })}>
                  <option value="eu">Frankfurt, eu-central</option>
                  <option value="us">Virginia, us-east</option>
                  <option value="ap">Tokyo, ap-northeast</option>
                </NativeSelect>
              </Field>
              <Switch checked={state.deployOnPush} onCheckedChange={(v) => set({ deployOnPush: v })}>
                {t.deployOnPush}
              </Switch>
              <Checkbox checked={state.requireReview} onChange={(e) => set({ requireReview: e.target.checked })}>
                {t.requireReview}
              </Checkbox>
            </div>
            <div className="studio-app__form-foot">
              <Button variant="ghost">{t.cancel}</Button>
              <Button variant="primary">{t.save}</Button>
            </div>
          </Card>

          <section className="mrd-dialog studio-app__dialog" data-size="sm" aria-labelledby={dialogTitle}>
            <h3 id={dialogTitle} className="mrd-dialog__title">
              {t.dialogTitle}
            </h3>
            <p className="mrd-dialog__description">{t.dialogText}</p>
            <div className="mrd-dialog__footer">
              <Button variant="secondary">{t.dialogKeep}</Button>
              <Button variant="danger">{t.dialogDelete}</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
