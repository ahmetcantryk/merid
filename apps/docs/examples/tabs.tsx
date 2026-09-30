"use client";

import { useState } from "react";
import { Tabs } from "@meridui/react";

const panel = { padding: "16px 0", color: "var(--mrd-body)", fontSize: 14 } as const;
const root = { width: "100%", maxWidth: 480 } as const;

export function TabsBasic() {
  return (
    <Tabs.Root defaultValue="overview" style={root}>
      <Tabs.List aria-label="Project">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Billing
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="overview" style={panel}>
        Three deployments this week, all healthy.
      </Tabs.Panel>
      <Tabs.Panel value="activity" style={panel}>
        Northwind merged 4 pull requests.
      </Tabs.Panel>
      <Tabs.Panel value="settings" style={panel}>
        Rename the project or change its region.
      </Tabs.Panel>
    </Tabs.Root>
  );
}


export function TabsControlled() {
  const [tab, setTab] = useState("week");
  return (
    <Tabs.Root value={tab} onValueChange={setTab} style={root}>
      <Tabs.List aria-label="Range">
        <Tabs.Trigger value="day">Day</Tabs.Trigger>
        <Tabs.Trigger value="week">Week</Tabs.Trigger>
        <Tabs.Trigger value="month">Month</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value={tab} style={panel}>
        Showing data for one {tab}.
      </Tabs.Panel>
    </Tabs.Root>
  );
}


export function TabsVertical() {
  return (
    <Tabs.Root defaultValue="profile" orientation="vertical" style={root}>
      <Tabs.List aria-label="Account">
        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="profile" style={panel}>
        Name, avatar and time zone.
      </Tabs.Panel>
      <Tabs.Panel value="security" style={panel}>
        Password and two-factor sign-in.
      </Tabs.Panel>
      <Tabs.Panel value="notifications" style={panel}>
        Email and in-app alerts.
      </Tabs.Panel>
    </Tabs.Root>
  );
}

