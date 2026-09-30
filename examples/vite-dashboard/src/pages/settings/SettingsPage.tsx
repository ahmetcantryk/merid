import { useState } from "react";
import { Stack, Tabs } from "@meridui/react";
import { hashQuery } from "../../lib/router";
import { PageHeader } from "../PageHeader";
import { BillingTab } from "./BillingTab";
import { GeneralTab } from "./GeneralTab";
import { MembersTab } from "./MembersTab";

const TABS = ["general", "members", "billing"] as const;
type Tab = (typeof TABS)[number];

function initialTab(): Tab {
  const tab = hashQuery().get("tab");
  return (TABS as readonly string[]).includes(tab ?? "") ? (tab as Tab) : "general";
}

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <Stack gap={7}>
      <PageHeader title="Settings" description="Workspace preferences, people and billing." />
      <Tabs.Root value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <Tabs.List aria-label="Settings sections">
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="members">Members</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="general" className="settings-panel">
          <GeneralTab />
        </Tabs.Panel>
        <Tabs.Panel value="members" className="settings-panel">
          <MembersTab />
        </Tabs.Panel>
        <Tabs.Panel value="billing" className="settings-panel">
          <BillingTab />
        </Tabs.Panel>
      </Tabs.Root>
    </Stack>
  );
}
