import { Avatar, DropdownMenu, useToast } from "@meridui/react";
import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { hrefFor } from "../lib/router";

export function AccountMenu() {
  const { toast } = useToast();
  const go = (hash: string) => () => { window.location.hash = hash; };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="account-trigger" aria-label="Account menu for Mara Lindqvist">
        <Avatar name="Mara Lindqvist" size="sm" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content placement="bottom-end">
        <DropdownMenu.Label>mara@northwind.example</DropdownMenu.Label>
        <DropdownMenu.Group>
          <DropdownMenu.Item leading={<User size={16} />} onSelect={go(hrefFor("settings"))}>Profile</DropdownMenu.Item>
          <DropdownMenu.Item leading={<CreditCard size={16} />} onSelect={go(hrefFor("settings", { tab: "billing" }))}>Billing</DropdownMenu.Item>
          <DropdownMenu.Item leading={<Settings size={16} />} onSelect={go(hrefFor("settings"))}>Settings</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          leading={<LogOut size={16} />}
          onSelect={() => toast({ title: "Signed out", description: "This demo keeps you signed in." })}
        >
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
