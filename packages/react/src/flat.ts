"use client";

/**
 * Flat names for every compound part. In React Server Component files, property access on a
 * client reference (`Dialog.Root`) is undefined on the server, so RSC files must use these
 * (`DialogRoot`, `DialogContent`, …). Client components may use either form.
 */
import { Accordion } from "./components/accordion/Accordion";
import { AlertDialog } from "./components/alert-dialog/AlertDialog";
import { Breadcrumb } from "./components/breadcrumb/Breadcrumb";
import { Dialog } from "./components/dialog/Dialog";
import { Drawer } from "./components/drawer/Drawer";
import { DropdownMenu } from "./components/dropdown-menu/DropdownMenu";
import { Popover } from "./components/popover/Popover";
import { Select } from "./components/select/Select";
import { SidebarNav } from "./components/sidebar-nav/SidebarNav";
import { Stepper } from "./components/stepper/Stepper";
import { Tabs } from "./components/tabs/Tabs";

export const AccordionRoot = Accordion.Root;
export const AccordionItem = Accordion.Item;
export const AccordionTrigger = Accordion.Trigger;
export const AccordionContent = Accordion.Content;

export const AlertDialogRoot = AlertDialog.Root;
export const AlertDialogTrigger = AlertDialog.Trigger;
export const AlertDialogContent = AlertDialog.Content;
export const AlertDialogTitle = AlertDialog.Title;
export const AlertDialogDescription = AlertDialog.Description;
export const AlertDialogFooter = AlertDialog.Footer;
export const AlertDialogAction = AlertDialog.Action;
export const AlertDialogCancel = AlertDialog.Cancel;

export const BreadcrumbRoot = Breadcrumb.Root;
export const BreadcrumbItem = Breadcrumb.Item;
export const BreadcrumbLink = Breadcrumb.Link;
export const BreadcrumbPage = Breadcrumb.Page;

export const DialogRoot = Dialog.Root;
export const DialogTrigger = Dialog.Trigger;
export const DialogContent = Dialog.Content;
export const DialogTitle = Dialog.Title;
export const DialogDescription = Dialog.Description;
export const DialogClose = Dialog.Close;
export const DialogFooter = Dialog.Footer;

export const DrawerRoot = Drawer.Root;
export const DrawerTrigger = Drawer.Trigger;
export const DrawerContent = Drawer.Content;
export const DrawerTitle = Drawer.Title;
export const DrawerDescription = Drawer.Description;
export const DrawerClose = Drawer.Close;
export const DrawerFooter = Drawer.Footer;

export const DropdownMenuRoot = DropdownMenu.Root;
export const DropdownMenuTrigger = DropdownMenu.Trigger;
export const DropdownMenuContent = DropdownMenu.Content;
export const DropdownMenuItem = DropdownMenu.Item;
export const DropdownMenuCheckboxItem = DropdownMenu.CheckboxItem;
export const DropdownMenuGroup = DropdownMenu.Group;
export const DropdownMenuLabel = DropdownMenu.Label;
export const DropdownMenuSeparator = DropdownMenu.Separator;

export const PopoverRoot = Popover.Root;
export const PopoverTrigger = Popover.Trigger;
export const PopoverContent = Popover.Content;
export const PopoverClose = Popover.Close;

export const SelectRoot = Select.Root;
export const SelectTrigger = Select.Trigger;
export const SelectContent = Select.Content;
export const SelectItem = Select.Item;

export const SidebarNavRoot = SidebarNav.Root;
export const SidebarNavGroup = SidebarNav.Group;

export const StepperRoot = Stepper.Root;
export const StepperStep = Stepper.Step;

export const TabsRoot = Tabs.Root;
export const TabsList = Tabs.List;
export const TabsTrigger = Tabs.Trigger;
export const TabsPanel = Tabs.Panel;
