"use client";

import {
  createContext,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { composeRefs, useComposedRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useId } from "../../internal/ovl-use-id";
import { withRef } from "../../internal/ovl-with-ref";
import { Dialog } from "../dialog/Dialog";
import { Shortcut } from "../shortcut/Shortcut";
import { matchesShortcut, type ShortcutKeyLabels } from "../shortcut/shortcut-keys";
import { type CommandFilter, defaultCommandFilter } from "./command-filter";

interface ItemRecord {
  select: () => void;
  shortcut: readonly string[] | undefined;
}

interface CommandContextValue {
  search: string;
  setSearch: (search: string) => void;
  active: string | null;
  setActive: (value: string | null) => void;
  matches: (value: string, keywords: readonly string[]) => boolean;
  filtering: boolean;
  count: number;
  label: string;
  shortcutLabels: ShortcutKeyLabels | undefined;
  listId: string;
  itemId: (value: string) => string;
  listRef: RefObject<HTMLDivElement | null>;
  register: (value: string, record: RefObject<ItemRecord>) => () => void;
  select: (value: string) => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommand(component: string) {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Command.Root>.`);
  return ctx;
}

const ITEM = "[data-mrd-command-item]:not([data-disabled])";

function visibleValues(list: HTMLElement | null): string[] {
  if (!list) return [];
  return Array.from(list.querySelectorAll<HTMLElement>(ITEM)).map((el) => el.dataset.value ?? "");
}

export interface CommandRootProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Controlled search text. */
  search?: string;
  /** Initial search text when uncontrolled. */
  defaultSearch?: string;
  /** Called when the search text changes. */
  onSearchChange?: (search: string) => void;
  /** Custom match function. Defaults to case- and accent-insensitive word matching. */
  filter?: CommandFilter;
  /** Set to false to filter items yourself (e.g. server-side search). Defaults to true. */
  shouldFilter?: boolean;
  /** Wrap from the last item to the first with the arrow keys. Defaults to true. */
  loop?: boolean;
  /** Called with the value of any item that is chosen, after the item's own `onSelect`. */
  onSelect?: (value: string) => void;
  /** Accessible name of the search box. Defaults to `"Command menu"`. */
  label?: string;
  /** Spoken key names for item shortcuts, merged over the English defaults (see `Shortcut`). */
  shortcutLabels?: ShortcutKeyLabels;
  /** Status announced to screen readers while searching. Defaults to `"1 result"` / `"N results"`. */
  resultsLabel?: (count: number) => string;
  /** Forwarded ref to the root element. */
  ref?: Ref<HTMLDivElement>;
}

const defaultResultsLabel = (count: number) => `${count} ${count === 1 ? "result" : "results"}`;

function CommandRoot({
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  filter = defaultCommandFilter,
  shouldFilter = true,
  loop = true,
  onSelect,
  label = "Command menu",
  resultsLabel = defaultResultsLabel,
  shortcutLabels,
  className,
  onKeyDown,
  children,
  ref,
  ...rest
}: CommandRootProps) {
  const [search, setSearch] = useControllableState({ value: searchProp, defaultValue: defaultSearch, onChange: onSearchChange });
  const [active, setActive] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId(undefined, "mrd-command");
  const registry = useRef(new Map<string, RefObject<ItemRecord>>());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const register = useCallback((value: string, record: RefObject<ItemRecord>) => {
    registry.current.set(value, record);
    return () => {
      if (registry.current.get(value) === record) registry.current.delete(value);
    };
  }, []);

  // After every render: keep the active item among the visible ones and track the result count.
  // Deliberately dependency-free: items mount, filter and unmount without Root knowing; setState only on change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const values = visibleValues(listRef.current);
    if (values.length !== count) setCount(values.length);
    if (active === null || !values.includes(active)) {
      const next = values[0] ?? null;
      if (next !== active) setActive(next);
    }
  });

  useEffect(() => {
    if (active === null || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[id="${baseId}-item-${encode(active)}"]`);
    el?.scrollIntoView?.({ block: "nearest" });
  }, [active, baseId]);

  const selectValue = useCallback((value: string) => {
    const record = registry.current.get(value);
    if (!record) return;
    record.current.select();
    onSelectRef.current?.(value);
  }, []);

  const move = (step: 1 | -1 | "first" | "last") => {
    const values = visibleValues(listRef.current);
    if (values.length === 0) return;
    if (step === "first") return setActive(values[0] ?? null);
    if (step === "last") return setActive(values[values.length - 1] ?? null);
    const index = active === null ? -1 : values.indexOf(active);
    let next = index + step;
    if (next >= values.length) next = loop ? 0 : values.length - 1;
    if (next < 0) next = loop ? values.length - 1 : 0;
    setActive(values[next] ?? null);
  };

  const ctx = useMemo<CommandContextValue>(
    () => ({
      search,
      setSearch,
      active,
      setActive,
      matches: (value, keywords) => !shouldFilter || filter(value, search, keywords),
      filtering: search.trim() !== "",
      count,
      label,
      shortcutLabels,
      listId: `${baseId}-list`,
      itemId: (value) => `${baseId}-item-${encode(value)}`,
      listRef,
      register,
      select: selectValue,
    }),
    [search, setSearch, active, shouldFilter, filter, count, label, shortcutLabels, baseId, register, selectValue],
  );

  return (
    <CommandContext.Provider value={ctx}>
      <div
        ref={ref}
        className={cx("mrd-command", className)}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || event.nativeEvent.isComposing) return;
          const plain = !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
          if (event.key === "ArrowDown" && plain) {
            event.preventDefault();
            move(1);
          } else if (event.key === "ArrowUp" && plain) {
            event.preventDefault();
            move(-1);
          } else if (event.key === "PageDown" || (event.key === "End" && event.ctrlKey)) {
            event.preventDefault();
            move("last");
          } else if (event.key === "PageUp" || (event.key === "Home" && event.ctrlKey)) {
            event.preventDefault();
            move("first");
          } else if (event.key === "Enter" && plain) {
            if (active === null) return;
            event.preventDefault();
            selectValue(active);
          } else if (event.ctrlKey || event.metaKey || event.altKey) {
            // Item shortcuts (with a modifier, so typing is never hijacked) run visible items directly.
            const values = visibleValues(listRef.current);
            for (const value of values) {
              const keys = registry.current.get(value)?.current.shortcut;
              if (keys && matchesShortcut(event, keys)) {
                event.preventDefault();
                selectValue(value);
                return;
              }
            }
          }
        }}
        {...rest}
      >
        {children}
        <div role="status" aria-live="polite" aria-atomic="true" className="mrd-visually-hidden">
          {ctx.filtering ? resultsLabel(count) : ""}
        </div>
      </div>
    </CommandContext.Provider>
  );
}

const encode = (value: string) => encodeURIComponent(value).replace(/%/g, "_");

export interface CommandInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type"> {
  /** Called with the new search text (in addition to Root's `onSearchChange`). */
  onValueChange?: (search: string) => void;
  /** Forwarded ref to the input. */
  ref?: Ref<HTMLInputElement>;
}

function SearchIcon() {
  return (
    <svg className="mrd-command__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CommandInput({
  onValueChange,
  placeholder = "Type a command or search…",
  className,
  ref,
  ...rest
}: CommandInputProps) {
  const ctx = useCommand("Command.Input");
  return (
    <div className="mrd-command__input-wrap">
      <SearchIcon />
      <input
        ref={ref}
        type="text"
        role="combobox"
        aria-expanded={ctx.count > 0}
        aria-controls={ctx.listId}
        aria-autocomplete="list"
        aria-activedescendant={ctx.active === null ? undefined : ctx.itemId(ctx.active)}
        aria-label={ctx.label}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={placeholder}
        className={cx("mrd-command__input", className)}
        value={ctx.search}
        onChange={(event) => {
          ctx.setSearch(event.target.value);
          onValueChange?.(event.target.value);
        }}
        {...rest}
      />
    </div>
  );
}

export interface CommandListProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name of the result list. Defaults to `"Suggestions"`. */
  label?: string;
  /** Forwarded ref to the listbox. */
  ref?: Ref<HTMLDivElement>;
}

function CommandList({ label = "Suggestions", className, ref, ...rest }: CommandListProps) {
  const ctx = useCommand("Command.List");
  const mergedRef = useComposedRefs(ctx.listRef, ref);
  return (
    <div
      ref={mergedRef}
      id={ctx.listId}
      // With no options a listbox is invalid ARIA; the list is then a plain container for Command.Empty.
      role={ctx.count > 0 ? "listbox" : undefined}
      aria-label={ctx.count > 0 ? label : undefined}
      className={cx("mrd-command__list", className)}
      {...rest}
    />
  );
}

export interface CommandEmptyProps extends HTMLAttributes<HTMLDivElement> {
  /** Forwarded ref to the element. */
  ref?: Ref<HTMLDivElement>;
}

function CommandEmpty({ className, children = "No results found.", ...rest }: CommandEmptyProps) {
  const ctx = useCommand("Command.Empty");
  if (ctx.count > 0) return null;
  return (
    <div role="presentation" className={cx("mrd-command__empty", className)} {...rest}>
      {children}
    </div>
  );
}

export interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Visible group heading; also names the group for screen readers. */
  heading?: ReactNode;
  /** Forwarded ref to the group element. */
  ref?: Ref<HTMLDivElement>;
}

function CommandGroup({ heading, className, children, ref, ...rest }: CommandGroupProps) {
  useCommand("Command.Group");
  const groupRef = useRef<HTMLDivElement | null>(null);
  const headingId = useId(undefined, "mrd-command-group");
  const [empty, setEmpty] = useState(false);
  // Hide the heading when the search filters out every item in the group.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const next = !groupRef.current?.querySelector("[data-mrd-command-item]");
    if (next !== empty) setEmpty(next);
  });
  return (
    <div ref={composeRefs(groupRef, ref)} role="presentation" hidden={empty} className={cx("mrd-command__group", className)} {...rest}>
      {heading ? (
        <div id={headingId} className="mrd-command__heading" aria-hidden="true">
          {heading}
        </div>
      ) : null}
      <div role="group" aria-labelledby={heading ? headingId : undefined}>
        {children}
      </div>
    </div>
  );
}

export interface CommandItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Unique value used for filtering and `onSelect`. Defaults to the text when children is a string. */
  value?: string;
  /** Extra search terms that also match this item. */
  keywords?: readonly string[];
  /** Called when the item is chosen by click, Enter or its shortcut. */
  onSelect?: (value: string) => void;
  /** Disable the item; it is skipped by the arrow keys. */
  disabled?: boolean;
  /** Icon shown before the label. */
  leading?: ReactNode;
  /** Keys shown after the label, e.g. `["mod", "s"]`. While the command menu has focus they also run the item. */
  shortcut?: readonly string[];
  /** Forwarded ref to the option element. */
  ref?: Ref<HTMLDivElement>;
}

function CommandItem({
  value: valueProp,
  keywords = [],
  onSelect,
  disabled = false,
  leading,
  shortcut,
  className,
  children,
  onClick,
  onPointerMove,
  ...rest
}: CommandItemProps) {
  const ctx = useCommand("Command.Item");
  const value = valueProp ?? (typeof children === "string" ? children : "");
  const record = useRef<ItemRecord>({ select: () => undefined, shortcut });
  record.current = { select: () => onSelect?.(value), shortcut };
  const { register } = ctx;
  const visible = ctx.matches(value, keywords);

  useLayoutEffect(() => {
    if (!visible || disabled) return undefined;
    return register(value, record);
  }, [register, value, visible, disabled]);

  if (!visible) return null;
  const isActive = ctx.active === value;
  return (
    <div
      id={ctx.itemId(value)}
      role="option"
      aria-selected={isActive}
      aria-disabled={disabled || undefined}
      data-active={isActive || undefined}
      data-disabled={disabled ? "" : undefined}
      data-mrd-command-item=""
      data-value={value}
      className={cx("mrd-command__item", className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;
        ctx.setActive(value);
        ctx.select(value);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!event.defaultPrevented && !disabled && !isActive) ctx.setActive(value);
      }}
      {...rest}
    >
      {leading ? <span className="mrd-command__leading" aria-hidden="true">{leading}</span> : null}
      <span className="mrd-command__label">{children}</span>
      {shortcut ? <Shortcut keys={shortcut} labels={ctx.shortcutLabels} size="sm" className="mrd-command__shortcut" /> : null}
    </div>
  );
}

export interface CommandSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Keep the separator while searching. Defaults to false (hidden while a search is typed). */
  alwaysRender?: boolean;
  /** Forwarded ref to the separator. */
  ref?: Ref<HTMLDivElement>;
}

function CommandSeparator({ alwaysRender = false, className, ...rest }: CommandSeparatorProps) {
  const ctx = useCommand("Command.Separator");
  if (ctx.filtering && !alwaysRender) return null;
  // Decorative: a listbox may only contain options and groups.
  return <div aria-hidden="true" className={cx("mrd-command__separator", className)} {...rest} />;
}

export interface CommandDialogProps extends Omit<CommandRootProps, "ref"> {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Global key combination that toggles the dialog. Defaults to `["mod", "k"]` (⌘K / Ctrl+K); `null` disables it. */
  shortcut?: readonly string[] | null;
  /** Close the dialog after an item is chosen. Defaults to true. */
  closeOnSelect?: boolean;
  /** Portal target; defaults to `document.body`. */
  container?: Element | null;
}

const DEFAULT_DIALOG_SHORTCUT = ["mod", "k"] as const;

function CommandDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  shortcut = DEFAULT_DIALOG_SHORTCUT,
  closeOnSelect = true,
  container,
  label = "Command menu",
  onSelect,
  className,
  ...rest
}: CommandDialogProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const shortcutKey = shortcut ? shortcut.join("+") : "";

  useEffect(() => {
    if (!shortcutKey) return undefined;
    const keys = shortcutKey.split("+");
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!matchesShortcut(event, keys)) return;
      event.preventDefault();
      setOpen((prev) => !prev);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [shortcutKey, setOpen]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content className="mrd-command-dialog" showClose={false} container={container}>
        <Dialog.Title className="mrd-visually-hidden">{label}</Dialog.Title>
        <CommandRoot
          label={label}
          className={className}
          onSelect={(value) => {
            onSelect?.(value);
            if (closeOnSelect) setOpen(false);
          }}
          {...rest}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}

/**
 * Command menu (WAI-ARIA APG "Combobox" with a listbox popup that is always shown): type to filter,
 * ArrowUp/Down to move, Enter to run. `Command.Dialog` puts it in a modal opened with ⌘K / Ctrl+K.
 */
export const Command = {
  Root: withRef("Command.Root", CommandRoot),
  Input: withRef("Command.Input", CommandInput),
  List: withRef("Command.List", CommandList),
  Empty: withRef("Command.Empty", CommandEmpty),
  Group: withRef("Command.Group", CommandGroup),
  Item: withRef("Command.Item", CommandItem),
  Separator: withRef("Command.Separator", CommandSeparator),
  Dialog: CommandDialog,
};
