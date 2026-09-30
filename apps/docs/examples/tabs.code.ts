export const tabsBasicCode = `import { Tabs } from "@meridui/react";

export function Example() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Project">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Billing
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="overview">Three deployments this week, all healthy.</Tabs.Panel>
      <Tabs.Panel value="activity">Northwind merged 4 pull requests.</Tabs.Panel>
      <Tabs.Panel value="settings">Rename the project or change its region.</Tabs.Panel>
    </Tabs.Root>
  );
}`;

export const tabsControlledCode = `const [tab, setTab] = useState("week");

<Tabs.Root value={tab} onValueChange={setTab}>
  <Tabs.List aria-label="Range">
    <Tabs.Trigger value="day">Day</Tabs.Trigger>
    <Tabs.Trigger value="week">Week</Tabs.Trigger>
    <Tabs.Trigger value="month">Month</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value={tab}>Showing data for one {tab}.</Tabs.Panel>
</Tabs.Root>`;

export const tabsVerticalCode = `<Tabs.Root defaultValue="profile" orientation="vertical">
  <Tabs.List aria-label="Account">
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger value="security">Security</Tabs.Trigger>
    <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="profile">Name, avatar and time zone.</Tabs.Panel>
  <Tabs.Panel value="security">Password and two-factor sign-in.</Tabs.Panel>
  <Tabs.Panel value="notifications">Email and in-app alerts.</Tabs.Panel>
</Tabs.Root>`;
