import type { ReactElement } from "react";
import {
  Accordion, Alert, AlertDialog, Avatar, AvatarGroup, Badge, Breadcrumb, Button, Card, Checkbox, Code,
  Container, Dialog, Drawer, DropdownMenu, EmptyState, Field, Grid, Heading, IconButton, Input, Kbd, Label,
  Link, NativeSelect, Pagination, Popover, Portal, Progress, Radio, RadioGroup, Section, SegmentedControl,
  Select, Separator, SidebarNav, SidebarNavItem, Skeleton, Spinner, Stack, Stepper, Switch, Table, TableBody,
  TableCell, TableHead, TableHeader, TableRow, Tabs, Text, Textarea, ToastProvider, Tooltip, VisuallyHidden,
} from "../src";
import {
  Collapsible, Command, ContextMenu, DataTable, type DataTableColumn, HoverCard, NavigationMenu, ScrollArea,
  Shortcut, Toolbar, useDataTable,
} from "../src";

const dataTableRows = [
  { id: "1", name: "Ada", age: 36 },
  { id: "2", name: "Grace", age: 85 },
];
const dataTableColumns: DataTableColumn<(typeof dataTableRows)[number]>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "age", header: "Age", accessor: "age", align: "end" },
];

function DataTableCase() {
  const table = useDataTable({ data: dataTableRows, columns: dataTableColumns, defaultPageSize: 1 });
  return <DataTable table={table} caption="People" selectable pageSizeOptions={[1, 10]} />;
}

/** One render case per exported component; overlays appear both closed and open. */
export const componentCases: Record<string, () => ReactElement> = {
  Accordion: () => (
    <Accordion.Root type="single" defaultValue="a">
      <Accordion.Item value="a">
        <Accordion.Trigger>One</Accordion.Trigger>
        <Accordion.Content>Body</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
  Alert: () => <Alert title="Heads up">Body</Alert>,
  AlertDialog: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Sure?</AlertDialog.Title>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action>Delete</AlertDialog.Action>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
  "AlertDialog (open)": () => (
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Content>
        <AlertDialog.Title>Sure?</AlertDialog.Title>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action>Delete</AlertDialog.Action>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
  Avatar: () => <Avatar name="Ada Lovelace" />,
  AvatarGroup: () => (
    <AvatarGroup aria-label="Team" max={1}>
      <Avatar name="A B" />
      <Avatar name="C D" />
    </AvatarGroup>
  ),
  Badge: () => <Badge>New</Badge>,
  Breadcrumb: () => (
    <Breadcrumb.Root>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Here</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.Root>
  ),
  Button: () => <Button>Save</Button>,
  Card: () => <Card>Body</Card>,
  Checkbox: () => <Checkbox>Accept</Checkbox>,
  Code: () => <Code>npm i</Code>,
  Collapsible: () => (
    <Collapsible.Root defaultOpen>
      <Collapsible.Trigger>Details</Collapsible.Trigger>
      <Collapsible.Content>Body</Collapsible.Content>
    </Collapsible.Root>
  ),
  Command: () => (
    <Command.Root>
      <Command.Input />
      <Command.List>
        <Command.Empty />
        <Command.Group heading="Pages">
          <Command.Item shortcut={["mod", "h"]}>Home</Command.Item>
        </Command.Group>
        <Command.Separator />
        <Command.Item>Settings</Command.Item>
      </Command.List>
    </Command.Root>
  ),
  "Command dialog": () => (
    <Command.Dialog defaultOpen>
      <Command.Input />
      <Command.List>
        <Command.Item>Home</Command.Item>
      </Command.List>
    </Command.Dialog>
  ),
  ContextMenu: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>Area</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Open</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
  Container: () => <Container>Body</Container>,
  DataTable: () => <DataTableCase />,
  Dialog: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Desc</Dialog.Description>
        <Dialog.Footer>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
  "Dialog (open)": () => (
    <Dialog.Root defaultOpen>
      <Dialog.Content>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  ),
  Drawer: () => (
    <Drawer.Root defaultOpen>
      <Drawer.Content>
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.Close />
      </Drawer.Content>
    </Drawer.Root>
  ),
  DropdownMenu: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Actions</DropdownMenu.Label>
        <DropdownMenu.Group>
          <DropdownMenu.Item>Edit</DropdownMenu.Item>
          <DropdownMenu.CheckboxItem>Hidden</DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
  EmptyState: () => <EmptyState title="Nothing here" />,
  Field: () => (
    <Field label="Name" description="Hint" error="Required">
      <Input />
    </Field>
  ),
  Grid: () => <Grid>Body</Grid>,
  Heading: () => <Heading>Title</Heading>,
  HoverCard: () => (
    <HoverCard.Root>
      <HoverCard.Trigger href="/ada">@ada</HoverCard.Trigger>
      <HoverCard.Content>Ada</HoverCard.Content>
    </HoverCard.Root>
  ),
  "HoverCard open": () => (
    <HoverCard.Root defaultOpen>
      <HoverCard.Trigger href="/ada">@ada</HoverCard.Trigger>
      <HoverCard.Content>Ada</HoverCard.Content>
    </HoverCard.Root>
  ),
  IconButton: () => <IconButton label="Close" icon={<span>x</span>} />,
  Input: () => <Input aria-label="Name" />,
  Kbd: () => <Kbd>K</Kbd>,
  Label: () => <Label>Name</Label>,
  Link: () => <Link href="/">Home</Link>,
  NativeSelect: () => (
    <NativeSelect aria-label="Region" defaultValue="eu">
      <option value="eu">EU</option>
    </NativeSelect>
  ),
  NavigationMenu: () => (
    <NavigationMenu.Root defaultValue="products">
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/a" description="Charts">Analytics</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/pricing" active>Pricing</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
  Pagination: () => <Pagination pageCount={10} defaultPage={5} />,
  Popover: () => (
    <Popover.Root defaultOpen>
      <Popover.Trigger>Share</Popover.Trigger>
      <Popover.Content aria-label="Share">Body</Popover.Content>
    </Popover.Root>
  ),
  Portal: () => (
    <Portal>
      <p>Portalled</p>
    </Portal>
  ),
  Progress: () => <Progress aria-label="Upload" value={40} />,
  RadioGroup: () => (
    <RadioGroup aria-label="Plan" defaultValue="a">
      <Radio value="a">A</Radio>
      <Radio value="b">B</Radio>
    </RadioGroup>
  ),
  ScrollArea: () => <ScrollArea maxHeight={120}>Body</ScrollArea>,
  Section: () => <Section>Body</Section>,
  SegmentedControl: () => (
    <SegmentedControl
      aria-label="View"
      options={[
        { value: "a", label: "A" },
        { value: "b", label: "B" },
      ]}
    />
  ),
  Select: () => (
    <Select.Root name="fruit" defaultValue="apple">
      <Select.Trigger aria-label="Fruit" />
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
  Separator: () => <Separator />,
  Shortcut: () => <Shortcut keys={["mod", "k"]} />,
  SidebarNav: () => (
    <SidebarNav aria-label="Main">
      <SidebarNavItem href="/" active>
        Overview
      </SidebarNavItem>
      <SidebarNav.Group label="Workspace">
        <SidebarNav.Item href="/p">Projects</SidebarNav.Item>
      </SidebarNav.Group>
    </SidebarNav>
  ),
  Skeleton: () => <Skeleton />,
  Spinner: () => <Spinner />,
  Stack: () => <Stack>Body</Stack>,
  Stepper: () => (
    <Stepper.Root current={1}>
      <Stepper.Step title="One" />
      <Stepper.Step title="Two" />
    </Stepper.Root>
  ),
  Switch: () => <Switch>Wifi</Switch>,
  Table: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  Tabs: () => (
    <Tabs.Root defaultValue="a">
      <Tabs.List aria-label="T">
        <Tabs.Trigger value="a">A</Tabs.Trigger>
        <Tabs.Trigger value="b">B</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="a">Panel A</Tabs.Panel>
      <Tabs.Panel value="b">Panel B</Tabs.Panel>
    </Tabs.Root>
  ),
  Text: () => <Text>Body</Text>,
  Textarea: () => <Textarea aria-label="Bio" />,
  Toolbar: () => (
    <Toolbar.Root aria-label="Formatting">
      <Toolbar.Group aria-label="Style">
        <Toolbar.Button>Bold</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Link href="/help">Help</Toolbar.Link>
    </Toolbar.Root>
  ),
  ToastProvider: () => (
    <ToastProvider>
      <p>app</p>
    </ToastProvider>
  ),
  Tooltip: () => (
    <Tooltip content="Copy">
      <Button>Copy</Button>
    </Tooltip>
  ),
  VisuallyHidden: () => <VisuallyHidden>Hidden</VisuallyHidden>,
};

/** Exports that are not standalone components (helpers, hooks, members covered by a parent case). */
export const nonComponentExports: ReadonlySet<string> = new Set([
  "compareValues",
  "cx",
  "DEFAULT_SHORTCUT_LABELS",
  "defaultCommandFilter",
  "defaultDataTableLabels",
  "detectPlatform",
  "filterRows",
  "formatShortcut",
  "keyLabel",
  "keySymbol",
  "matchesShortcut",
  "nextSort",
  "paginate",
  "sortRows",
  "useDataTable",
  "usePlatform",
  "getInitials",
  "getPageRange",
  "useFieldContext",
  "useToast",
  "Radio",
  "TableBody",
  "TableCell",
  "TableHead",
  "TableHeader",
  "TableRow",
  "SidebarNavItem",
]);
