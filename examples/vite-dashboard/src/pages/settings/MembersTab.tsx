import { Avatar, Badge, Card, Stack, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from "@meridui/react";
import { MEMBERS } from "../../lib/data";

export function MembersTab() {
  return (
    <Card padding="none" className="members-card">
      <Table aria-label="Workspace members" scrollLabel="Workspace members">
        <TableHead>
          <TableRow>
            <TableHeader>Member</TableHeader>
            <TableHeader align="end">Role</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {MEMBERS.map((m) => (
            <TableRow key={m.email}>
              <TableCell>
                <Stack direction="row" gap={3} align="center">
                  <Avatar name={m.name} size="sm" />
                  <Stack gap={0}>
                    <Text size="sm" weight="medium" tone="ink">{m.name}</Text>
                    <Text size="xs" tone="muted">{m.email}</Text>
                  </Stack>
                </Stack>
              </TableCell>
              <TableCell align="end">
                <Badge tone={m.role === "Owner" ? "accent" : "neutral"}>{m.role}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
