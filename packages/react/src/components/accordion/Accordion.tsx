import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { composeRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useId } from "../../internal/ovl-use-id";
import { useRovingFocus } from "../../internal/ovl-use-roving-focus";

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  baseId: string;
  headingLevel: 2 | 3 | 4 | 5 | 6;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
interface ItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}
const ItemContext = createContext<ItemContextValue | null>(null);

function useRequired<T>(ctx: T | null, component: string): T {
  if (!ctx) throw new Error(`<${component}> must be used inside <Accordion.Root>/<Accordion.Item>.`);
  return ctx;
}

interface AccordionCommonProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Heading level wrapping each trigger. Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Forwarded ref to the root element. */
  ref?: Ref<HTMLDivElement>;
}

export interface AccordionSingleProps extends AccordionCommonProps {
  /** One item open at a time. */
  type: "single";
  /** Controlled open item (`""` for none). */
  value?: string;
  /** Initially open item when uncontrolled. */
  defaultValue?: string;
  /** Called with the open item value (`""` when all closed). */
  onValueChange?: (value: string) => void;
  /** Allow closing the open item. Defaults to true. */
  collapsible?: boolean;
}

export interface AccordionMultipleProps extends AccordionCommonProps {
  /** Any number of items open. */
  type: "multiple";
  /** Controlled open items. */
  value?: string[];
  /** Initially open items when uncontrolled. */
  defaultValue?: string[];
  /** Called with the open item values. */
  onValueChange?: (value: string[]) => void;
}

export type AccordionRootProps = AccordionSingleProps | AccordionMultipleProps;

const EMPTY: string[] = [];

function AccordionRoot(props: AccordionRootProps) {
  const { type, headingLevel = 3, className, onKeyDown, ref } = props;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId(undefined, "mrd-accordion");

  const toArray = (v: string | string[] | undefined) =>
    v === undefined ? undefined : Array.isArray(v) ? v : v === "" ? EMPTY : [v];
  const [open, setOpen] = useControllableState<string[]>({
    value: toArray(props.value),
    defaultValue: toArray(props.defaultValue) ?? EMPTY,
    onChange: (next) => {
      if (props.type === "multiple") props.onValueChange?.(next);
      else props.onValueChange?.(next[0] ?? "");
    },
  });
  const collapsible = props.type === "single" ? (props.collapsible ?? true) : true;

  const toggle = useCallback(
    (value: string) => {
      setOpen((prev) => {
        const isOpen = prev.includes(value);
        if (type === "multiple") return isOpen ? prev.filter((v) => v !== value) : [...prev, value];
        if (isOpen) return collapsible ? EMPTY : prev;
        return [value];
      });
    },
    [setOpen, type, collapsible],
  );

  const ctx = useMemo<AccordionContextValue>(
    () => ({ isOpen: (v) => open.includes(v), toggle, baseId, headingLevel }),
    [open, toggle, baseId, headingLevel],
  );
  const roving = useRovingFocus(rootRef, { orientation: "vertical", loop: true });

  const {
    type: _t,
    value: _v,
    defaultValue: _d,
    onValueChange: _o,
    headingLevel: _h,
    className: _c,
    onKeyDown: _k,
    ref: _r,
    collapsible: _col,
    ...rest
  } = props as AccordionCommonProps & {
    type: unknown;
    value?: unknown;
    defaultValue?: unknown;
    onValueChange?: unknown;
    collapsible?: unknown;
  };

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        ref={composeRefs(rootRef, ref)}
        className={cx("mrd-accordion", className)}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if ((event.target as HTMLElement).matches("[data-mrd-roving]")) roving(event);
        }}
        {...rest}
      />
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique value of this item. */
  value: string;
  /** Prevent toggling. */
  disabled?: boolean;
}

function AccordionItem({ value, disabled = false, className, ...rest }: AccordionItemProps) {
  const ctx = useRequired(useContext(AccordionContext), "Accordion.Item");
  const open = ctx.isOpen(value);
  const key = encodeURIComponent(value).replace(/%/g, "_");
  const item = useMemo(
    () => ({
      value,
      open,
      disabled,
      triggerId: `${ctx.baseId}-trigger-${key}`,
      contentId: `${ctx.baseId}-content-${key}`,
    }),
    [value, open, disabled, ctx.baseId, key],
  );
  return (
    <ItemContext.Provider value={item}>
      <div data-state={open ? "open" : "closed"} className={cx("mrd-accordion__item", className)} {...rest} />
    </ItemContext.Provider>
  );
}

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Forwarded ref to the button. */
  ref?: Ref<HTMLButtonElement>;
}

function PlusIcon() {
  return (
    <svg className="mrd-accordion__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function AccordionTrigger({ className, children, onClick, ...rest }: AccordionTriggerProps) {
  const root = useRequired(useContext(AccordionContext), "Accordion.Trigger");
  const item = useRequired(useContext(ItemContext), "Accordion.Trigger");
  const Heading = `h${root.headingLevel}` as "h3";
  return (
    <Heading className="mrd-accordion__heading">
      <button
        type="button"
        id={item.triggerId}
        aria-expanded={item.open}
        aria-controls={item.contentId}
        aria-disabled={item.disabled || undefined}
        data-state={item.open ? "open" : "closed"}
        data-mrd-roving=""
        className={cx("mrd-accordion__trigger", className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && !item.disabled) root.toggle(item.value);
        }}
        {...rest}
      >
        <span className="mrd-accordion__trigger-text">{children}</span>
        <PlusIcon />
      </button>
    </Heading>
  );
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Forwarded ref to the region. */
  ref?: Ref<HTMLDivElement>;
}

function AccordionContent({ className, children, ...rest }: AccordionContentProps) {
  const item = useRequired(useContext(ItemContext), "Accordion.Content");
  return (
    <div
      role="region"
      id={item.contentId}
      aria-labelledby={item.triggerId}
      hidden={!item.open}
      data-state={item.open ? "open" : "closed"}
      className={cx("mrd-accordion__content", className)}
      {...rest}
    >
      {item.open ? children : null}
    </div>
  );
}

/** Accordion (WAI-ARIA APG "Accordion"): heading-wrapped buttons, ArrowUp/Down/Home/End between headers. */
export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};
