import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
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
import { type Placement, useAnchored } from "../../internal/ovl-floating";
import { Portal } from "../../internal/ovl-portal";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useDismiss } from "../../internal/ovl-use-dismiss";
import { useId } from "../../internal/ovl-use-id";
import { findTypeaheadMatch } from "../../internal/ovl-use-roving-focus";

interface OptionRecord {
  value: string;
  label: string;
  disabled: boolean;
}

interface SelectContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  select: (value: string) => void;
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  options: OptionRecord[];
  register: (option: OptionRecord) => () => void;
  listboxId: string;
  triggerId: string;
  optionId: (value: string) => string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  listboxRef: RefObject<HTMLDivElement | null>;
  disabled: boolean;
  placeholder: ReactNode;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect(component: string) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Select.Root>.`);
  return ctx;
}

export interface SelectRootProps {
  /** Controlled selected value (`""` means nothing selected). */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Form field name; renders a hidden input carrying the value. */
  name?: string;
  /** Marks the hidden input as required. */
  required?: boolean;
  /** Disable the whole select. */
  disabled?: boolean;
  /** Shown in the trigger when no value is selected. */
  placeholder?: ReactNode;
  /** Associates the hidden input with a form by id. */
  form?: string;
  /** Trigger and Content. */
  children?: ReactNode;
}

function SelectRoot({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  name,
  required,
  disabled = false,
  placeholder = "Select…",
  form,
  children,
}: SelectRootProps) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const [options, setOptions] = useState<OptionRecord[]>([]);
  const baseId = useId(undefined, "mrd-select");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  const register = useCallback((option: OptionRecord) => {
    setOptions((prev) => [...prev.filter((o) => o.value !== option.value), option]);
    return () => setOptions((prev) => prev.filter((o) => o.value !== option.value));
  }, []);

  const select = useCallback(
    (next: string) => {
      setValue(next);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [setValue, setOpen],
  );

  const ctx = useMemo<SelectContextValue>(
    () => ({
      open: open && !disabled,
      setOpen,
      value,
      select,
      activeValue,
      setActiveValue,
      options,
      register,
      listboxId: `${baseId}-listbox`,
      triggerId: `${baseId}-trigger`,
      optionId: (v) => `${baseId}-opt-${encodeURIComponent(v).replace(/%/g, "_")}`,
      triggerRef,
      listboxRef,
      disabled,
      placeholder,
    }),
    [open, setOpen, value, select, activeValue, options, register, baseId, disabled, placeholder],
  );

  return (
    <SelectContext.Provider value={ctx}>
      {children}
      {name ? (
        <input type="hidden" name={name} value={value} required={required} disabled={disabled} form={form} />
      ) : null}
    </SelectContext.Provider>
  );
}

/** Options in DOM order (registration order can differ after re-renders). */
function orderedOptions(ctx: SelectContextValue): OptionRecord[] {
  const list = ctx.listboxRef.current;
  if (!list) return ctx.options;
  const order = Array.from(list.querySelectorAll<HTMLElement>("[role='option']")).map((el) => el.dataset.value);
  return [...ctx.options].sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value));
}

export interface SelectTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Control size. Defaults to `"md"`. */
  size?: "sm" | "md" | "lg";
  /** Marks the field invalid (danger border). */
  invalid?: boolean;
  /** Forwarded ref to the combobox button. */
  ref?: Ref<HTMLButtonElement>;
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SelectTrigger({ size = "md", invalid, className, onKeyDown, onClick, children, ref, ...rest }: SelectTriggerProps) {
  const ctx = useSelect("Select.Trigger");
  const buffer = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const openList = (active: string | null) => {
    ctx.setActiveValue(active);
    ctx.setOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || ctx.disabled) return;
    const enabled = orderedOptions(ctx).filter((o) => !o.disabled);
    if (enabled.length === 0) return;
    const current = ctx.open ? ctx.activeValue : ctx.value;
    const index = enabled.findIndex((o) => o.value === current);
    const move = (i: number) => {
      const target = enabled[Math.min(Math.max(i, 0), enabled.length - 1)];
      if (target) openList(target.value);
    };

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!ctx.open) openList(index >= 0 ? enabled[index]!.value : enabled[0]!.value);
        else move(index + 1);
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!ctx.open) openList(index >= 0 ? enabled[index]!.value : enabled[0]!.value);
        else move(index - 1);
        return;
      case "Home":
        event.preventDefault();
        move(0);
        return;
      case "End":
        event.preventDefault();
        move(enabled.length - 1);
        return;
      case "Enter":
      case " ":
        if (event.key === " " && buffer.current) break;
        event.preventDefault();
        if (ctx.open && ctx.activeValue !== null) ctx.select(ctx.activeValue);
        else if (!ctx.open) openList(index >= 0 ? enabled[index]!.value : enabled[0]!.value);
        return;
      case "Tab":
        if (ctx.open) {
          if (ctx.activeValue !== null) ctx.select(ctx.activeValue);
          ctx.setOpen(false);
        }
        return;
      default:
        break;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      clearTimeout(timer.current);
      buffer.current += event.key.toLowerCase();
      timer.current = setTimeout(() => {
        buffer.current = "";
      }, 500);
      const match = findTypeaheadMatch(enabled, index, buffer.current, (o) => o.label.toLowerCase());
      if (!match) return;
      event.preventDefault();
      if (ctx.open) ctx.setActiveValue(match.value);
      else ctx.select(match.value);
    }
  };

  const selected = ctx.options.find((o) => o.value === ctx.value);

  return (
    <button
      ref={composeRefs(ctx.triggerRef, ref)}
      id={ctx.triggerId}
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      aria-controls={ctx.listboxId}
      aria-activedescendant={ctx.open && ctx.activeValue !== null ? ctx.optionId(ctx.activeValue) : undefined}
      aria-invalid={invalid || undefined}
      disabled={ctx.disabled}
      data-size={size}
      data-state={ctx.open ? "open" : "closed"}
      data-placeholder={selected ? undefined : ""}
      className={cx("mrd-select__trigger", className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (ctx.open) ctx.setOpen(false);
        else openList(ctx.value || orderedOptions(ctx).find((o) => !o.disabled)?.value || null);
      }}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <span className="mrd-select__value">{children ?? (selected ? selected.label : ctx.placeholder)}</span>
      <span className="mrd-select__icon">
        <ChevronIcon />
      </span>
    </button>
  );
}

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Preferred placement. Defaults to `"bottom-start"`. */
  placement?: Placement;
  /** Distance from the trigger in px. Defaults to 6. */
  sideOffset?: number;
  /** Portal target; defaults to `document.body`. */
  container?: Element | null;
  /** Forwarded ref to the listbox. */
  ref?: Ref<HTMLDivElement>;
}

function SelectContent({ placement = "bottom-start", sideOffset = 6, container, className, style, ref, ...rest }: SelectContentProps) {
  const ctx = useSelect("Select.Content");
  const { refs, floatingStyles } = useAnchored({ open: ctx.open, placement, sideOffset, matchWidth: true });

  useLayoutEffect(() => {
    refs.setReference(ctx.triggerRef.current);
  }, [refs, ctx.triggerRef, ctx.open]);

  useDismiss([ctx.listboxRef, ctx.triggerRef], ctx.open, () => ctx.setOpen(false));

  useEffect(() => {
    if (!ctx.open || ctx.activeValue === null) return;
    document.getElementById(ctx.optionId(ctx.activeValue))?.scrollIntoView?.({ block: "nearest" });
  }, [ctx.open, ctx.activeValue, ctx]);

  const mergedRef = useComposedRefs(ctx.listboxRef, ctx.open ? refs.setFloating : undefined, ref);

  // The listbox stays mounted (hidden) so options can register their labels for the trigger.
  return (
    <Portal container={container}>
      <div
        ref={mergedRef}
        id={ctx.listboxId}
        role="listbox"
        aria-labelledby={ctx.triggerId}
        hidden={!ctx.open}
        tabIndex={-1}
        data-state={ctx.open ? "open" : "closed"}
        className={cx("mrd-select__content", className)}
        style={ctx.open ? { ...floatingStyles, ...style } : style}
        onMouseDown={(event) => event.preventDefault()}
        {...rest}
      />
    </Portal>
  );
}

export interface SelectItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Value submitted and reported by `onValueChange`. */
  value: string;
  /** Visible label. Also used in the trigger and for typeahead. */
  children: string;
  /** Disable the option. */
  disabled?: boolean;
}

function SelectItem({ value, children, disabled = false, className, ...rest }: SelectItemProps) {
  const ctx = useSelect("Select.Item");
  const { register } = ctx;
  useLayoutEffect(() => register({ value, label: children, disabled }), [register, value, children, disabled]);
  const selected = ctx.value === value;
  const active = ctx.activeValue === value;
  return (
    <div
      id={ctx.optionId(value)}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-value={value}
      data-active={active ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      className={cx("mrd-select__item", className)}
      onClick={() => {
        if (!disabled) ctx.select(value);
      }}
      onPointerMove={() => {
        if (!disabled && !active) ctx.setActiveValue(value);
      }}
      {...rest}
    >
      <span className="mrd-select__item-text">{children}</span>
      {selected ? (
        <svg className="mrd-select__check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
          <path d="M3 7.5l2.5 2.5L11 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  );
}

/**
 * Select-only combobox (WAI-ARIA APG "Select-Only Combobox"). Focus stays on the trigger;
 * the active option is exposed through `aria-activedescendant`. Pass `name` for form submission.
 * Label it with `aria-label` or `aria-labelledby` on `Select.Trigger` (or a `<label htmlFor>` pointing at its `id`).
 */
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
};
