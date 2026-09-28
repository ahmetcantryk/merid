import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
  useContext,
  useMemo,
  useRef,
} from "react";
import { composeRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useId } from "../../internal/ovl-use-id";
import { type Orientation, useRovingFocus } from "../../internal/ovl-use-roving-focus";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  orientation: Orientation;
  tabId: (value: string) => string;
  panelId: (value: string) => string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tabs.Root>.`);
  return ctx;
}

const safe = (v: string) => encodeURIComponent(v).replace(/%/g, "_");

export interface TabsRootProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Controlled selected tab value. */
  value?: string;
  /** Initially selected tab value when uncontrolled. */
  defaultValue?: string;
  /** Called when the selected tab changes. */
  onValueChange?: (value: string) => void;
  /** Arrow-key axis. Defaults to `"horizontal"`. */
  orientation?: Orientation;
  /** Forwarded ref to the root element. */
  ref?: Ref<HTMLDivElement>;
}

function TabsRoot({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  className,
  ...rest
}: TabsRootProps) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const baseId = useId(undefined, "mrd-tabs");
  const ctx = useMemo<TabsContextValue>(
    () => ({
      value,
      setValue,
      orientation,
      tabId: (v) => `${baseId}-tab-${safe(v)}`,
      panelId: (v) => `${baseId}-panel-${safe(v)}`,
    }),
    [value, setValue, orientation, baseId],
  );
  return (
    <TabsContext.Provider value={ctx}>
      <div data-orientation={orientation} className={cx("mrd-tabs", className)} {...rest} />
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style. Only `"line"` today. */
  variant?: "line";
  /** Forwarded ref to the tablist. */
  ref?: Ref<HTMLDivElement>;
}

function TabsList({ variant = "line", className, onKeyDown, ref, ...rest }: TabsListProps) {
  const ctx = useTabs("Tabs.List");
  const listRef = useRef<HTMLDivElement | null>(null);
  const roving = useRovingFocus(listRef, {
    orientation: ctx.orientation,
    loop: true,
    onMove: (item) => {
      const value = item.dataset.value;
      if (value !== undefined) ctx.setValue(value);
    },
  });
  return (
    <div
      ref={composeRefs(listRef, ref)}
      role="tablist"
      aria-orientation={ctx.orientation}
      data-variant={variant}
      className={cx("mrd-tabs__list", className)}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) roving(event);
      }}
      {...rest}
    />
  );
}

export interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Value identifying this tab and its panel. */
  value: string;
  /** Forwarded ref to the tab button. */
  ref?: Ref<HTMLButtonElement>;
}

function TabsTrigger({ value, disabled, className, onClick, ...rest }: TabsTriggerProps) {
  const ctx = useTabs("Tabs.Trigger");
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={ctx.tabId(value)}
      aria-selected={selected}
      aria-controls={ctx.panelId(value)}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-value={value}
      data-state={selected ? "active" : "inactive"}
      data-disabled={disabled ? "" : undefined}
      data-mrd-roving=""
      className={cx("mrd-tabs__trigger", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) ctx.setValue(value);
      }}
      {...rest}
    />
  );
}

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Value of the tab that owns this panel. */
  value: string;
  /** Keep the panel mounted (hidden) while inactive. Defaults to false. */
  forceMount?: boolean;
  /** Forwarded ref to the panel. */
  ref?: Ref<HTMLDivElement>;
}

function TabsPanel({ value, forceMount = false, className, children, ...rest }: TabsPanelProps) {
  const ctx = useTabs("Tabs.Panel");
  const selected = ctx.value === value;
  if (!selected && !forceMount) return null;
  return (
    <div
      role="tabpanel"
      id={ctx.panelId(value)}
      aria-labelledby={ctx.tabId(value)}
      tabIndex={0}
      hidden={!selected}
      data-state={selected ? "active" : "inactive"}
      className={cx("mrd-tabs__panel", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Tabs (WAI-ARIA APG "Tabs, automatic activation"): arrow keys move and select, Home/End jump. */
export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel,
};
