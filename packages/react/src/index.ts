// Public entry for @meridui/react. Styles: import "@meridui/react/styles.css" once.

// primitives
export * from "./components/button";
export * from "./components/icon-button";
export * from "./components/link";
export * from "./components/badge";
export * from "./components/card";
export * from "./components/separator";
export * from "./components/spinner";
export * from "./components/skeleton";
export * from "./components/kbd";
export * from "./components/code";
export * from "./components/avatar";
export * from "./components/progress";
export * from "./components/alert";
export * from "./components/table";
export * from "./components/empty-state";
export * from "./components/visually-hidden";

// layout & typography
export * from "./components/stack";
export * from "./components/grid";
export * from "./components/container";
export * from "./components/section";
export * from "./components/heading";
export * from "./components/text";

// forms
export * from "./components/label";
export * from "./components/field";
export * from "./components/input";
export * from "./components/textarea";
export * from "./components/checkbox";
export * from "./components/radio";
export * from "./components/switch";
export * from "./components/native-select";
export * from "./components/segmented-control";

// forms and inputs (batch 1)
export * from "./components/calendar";
export * from "./components/combobox";
export * from "./components/date-picker";
export * from "./components/file-upload";
export * from "./components/number-input";
export * from "./components/pin-input";
export * from "./components/slider";
export * from "./components/toggle";

// utilities
export { cx } from "./utils/cx";

// overlay & navigation components (added separately)
export { Portal, type PortalProps } from "./components/portal";
export { Dialog, type DialogRootProps, type DialogTriggerProps, type DialogContentProps, type DialogTitleProps, type DialogDescriptionProps, type DialogCloseProps, type DialogFooterProps, type DialogSize } from "./components/dialog";
export { AlertDialog, type AlertDialogRootProps, type AlertDialogContentProps, type AlertDialogActionProps, type AlertDialogCancelProps, type AlertDialogActionTone } from "./components/alert-dialog";
export { Drawer, type DrawerRootProps, type DrawerContentProps, type DrawerSide, type DrawerSize } from "./components/drawer";
export { Popover, type PopoverRootProps, type PopoverTriggerProps, type PopoverContentProps, type PopoverCloseProps } from "./components/popover";
export { Tooltip, type TooltipProps } from "./components/tooltip";
export { DropdownMenu, type DropdownMenuRootProps, type DropdownMenuTriggerProps, type DropdownMenuContentProps, type DropdownMenuItemProps, type DropdownMenuCheckboxItemProps, type DropdownMenuGroupProps, type DropdownMenuLabelProps, type DropdownMenuSeparatorProps } from "./components/dropdown-menu";
export { Select, type SelectRootProps, type SelectTriggerProps, type SelectContentProps, type SelectItemProps } from "./components/select";
export { Tabs, type TabsRootProps, type TabsListProps, type TabsTriggerProps, type TabsPanelProps } from "./components/tabs";
export { Accordion, type AccordionRootProps, type AccordionSingleProps, type AccordionMultipleProps, type AccordionItemProps, type AccordionTriggerProps, type AccordionContentProps } from "./components/accordion";
export { ToastProvider, useToast, type ToastProviderProps, type ToastOptions, type ToastTone, type ToastApi } from "./components/toast";
export { Breadcrumb, type BreadcrumbRootProps, type BreadcrumbItemProps, type BreadcrumbLinkProps, type BreadcrumbPageProps } from "./components/breadcrumb";
export { Pagination, getPageRange, type PaginationProps, type PaginationLinkProps, type PageRangeItem } from "./components/pagination";
export { Stepper, type StepperRootProps, type StepperStepProps, type StepState } from "./components/stepper";
export { SidebarNav, SidebarNavItem, type SidebarNavProps, type SidebarNavGroupProps, type SidebarNavItemProps } from "./components/sidebar-nav";

// Flat names for every compound part (required in React Server Component files).
export * from "./flat";
export type { Placement } from "./internal/ovl-floating";
