"use client";

import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { composeRefs } from "../../internal/ovl-compose-refs";
import { cx } from "../../internal/ovl-cx";
import { type Placement, useAnchored } from "../../internal/ovl-floating";
import { Portal } from "../../internal/ovl-portal";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { useDismiss } from "../../internal/ovl-use-dismiss";
import { useId } from "../../internal/ovl-use-id";
import { withRef } from "../../internal/ovl-with-ref";
import { useFieldContext, useFieldControlProps } from "../field/field-context";

export interface ComboboxOption {
  /** Value submitted and reported by `onValueChange`. */
  value: string;
  /** Visible label, matched against the typed text. */
  label: string;
  /** Secondary line under the label. */
  description?: string;
  /** Shown but not selectable. */
  disabled?: boolean;
}

interface ComboboxBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** The options. For async search, replace them as results arrive and set `filter={false}`. */
  options: readonly ComboboxOption[];
  /** Typed text (controlled). */
  inputValue?: string;
  /** Initial typed text (uncontrolled). */
  defaultInputValue?: string;
  /** Called on every keystroke; fetch async options from here. */
  onInputValueChange?: (text: string) => void;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Client-side filter. Defaults to a case-insensitive "label contains text" match in `locale`.
   * Pass `false` when the options are already filtered (server search).
   */
  filter?: ((option: ComboboxOption, text: string) => boolean) | false;
  /** Shows `loadingMessage` and marks the list busy. */
  loading?: boolean;
  /** Placeholder of the text field. */
  placeholder?: string;
  /** Shown when no option matches. Defaults to `"No results"`. */
  emptyMessage?: ReactNode;
  /** Shown while `loading`. Defaults to `"Loading…"`. */
  loadingMessage?: ReactNode;
  /** Accessible name of the chevron button. Defaults to `"Show options"`. */
  toggleLabel?: string;
  /** Accessible name of a chip's remove button (multiple). Defaults to `(label) => \`Remove ${label}\``. */
  getRemoveLabel?: (label: string) => string;
  /** Locale used for case-insensitive matching (e.g. `"tr-TR"` so İ/ı match correctly). */
  locale?: string;
  /** Control size. Defaults to `"md"`. */
  size?: "sm" | "md" | "lg";
  /** Invalid style and `aria-invalid`. Inside a `Field`, derived from its `error`. */
  invalid?: boolean;
  /** Disables the combobox. */
  disabled?: boolean;
  /** Marks the field required. */
  required?: boolean;
  /** Form field name; renders hidden input(s) carrying the value(s). */
  name?: string;
  /** id of the text input (for `<label htmlFor>`). Inside a `Field`, set automatically. */
  inputId?: string;
  /** Preferred list placement. Defaults to `"bottom-start"`. */
  placement?: Placement;
  /** Portal target; defaults to `document.body`. */
  container?: Element | null;
  /** Forwarded ref to the text input. */
  inputRef?: Ref<HTMLInputElement>;
  /** Forwarded ref to the root element. */
  ref?: Ref<HTMLDivElement>;
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  /** Select one value. */
  multiple?: false;
  /** Selected value (controlled); `""` means none. */
  value?: string;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string;
  /** Called with the new value (`""` when cleared). */
  onValueChange?: (value: string) => void;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  /** Select any number of values, shown as removable chips. */
  multiple: true;
  /** Selected values (controlled). */
  value?: string[];
  /** Initially selected values (uncontrolled). */
  defaultValue?: string[];
  /** Called with the new list of values. */
  onValueChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

const toList = (v: string | string[] | undefined): string[] => (v === undefined || v === "" ? [] : Array.isArray(v) ? v : [v]);

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="mrd-combobox__check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 7.5l2.5 2.5L11 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Editable combobox with list autocomplete (WAI-ARIA APG "Combobox With Listbox Popup").
 * Focus stays in the text field; the highlighted option is exposed via `aria-activedescendant`.
 * `multiple` keeps the list open and shows selections as chips.
 */
function ComboboxImpl(props: ComboboxProps) {
  const {
    options,
    multiple = false,
    value,
    defaultValue,
    onValueChange,
    inputValue: inputValueProp,
    defaultInputValue,
    onInputValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    filter,
    loading = false,
    placeholder,
    emptyMessage = "No results",
    loadingMessage = "Loading…",
    toggleLabel = "Show options",
    getRemoveLabel = (label: string) => `Remove ${label}`,
    locale,
    size = "md",
    invalid,
    disabled,
    required,
    name,
    inputId,
    placement = "bottom-start",
    container,
    inputRef,
    className,
    ref,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  } = props;

  const [selected, setSelected] = useControllableState<string[]>({
    value: value === undefined ? undefined : toList(value),
    defaultValue: toList(defaultValue),
    onChange: (next) => {
      if (multiple) (onValueChange as ((v: string[]) => void) | undefined)?.(next);
      else (onValueChange as ((v: string) => void) | undefined)?.(next[0] ?? "");
    },
  });
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  // Remember labels of chosen options so they still render after async results change.
  const [known, setKnown] = useState<Record<string, string>>({});
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? known[v] ?? v;
  const singleLabel = !multiple && selected[0] !== undefined ? labelOf(selected[0]) : "";

  const [text, setTextState] = useControllableState({
    value: inputValueProp,
    defaultValue: defaultInputValue ?? singleLabel,
    onChange: onInputValueChange,
  });
  const [typing, setTyping] = useState(false);
  const [activeValue, setActiveValue] = useState<string | null>(null);

  const field = useFieldContext();
  const { invalid: isInvalid, id: controlId, ...wiring } = useFieldControlProps({
    id: inputId,
    disabled,
    required,
    invalid,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
  });
  const isDisabled = Boolean(wiring.disabled);
  const baseId = useId(undefined, "mrd-combobox");
  const listboxId = `${baseId}-listbox`;
  const optionId = (v: string) => `${baseId}-opt-${encodeURIComponent(v).replace(/%/g, "_")}`;
  const labelledBy = ariaLabelledBy ?? (ariaLabel === undefined && field ? field.labelId : undefined);

  const controlRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const localInputRef = useRef<HTMLInputElement | null>(null);
  const isOpen = open && !isDisabled;
  const { refs, floatingStyles } = useAnchored({ open: isOpen, placement, sideOffset: 6, matchWidth: true });

  useLayoutEffect(() => {
    refs.setReference(controlRef.current);
  }, [refs, isOpen]);

  const matcher = useMemo(() => {
    if (filter === false) return null;
    if (filter) return filter;
    return (option: ComboboxOption, query: string) =>
      option.label.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale));
  }, [filter, locale]);

  const visible = useMemo(
    () => (matcher && typing && text.trim() !== "" ? options.filter((o) => matcher(o, text)) : [...options]),
    [matcher, typing, text, options],
  );
  const enabled = visible.filter((o) => !o.disabled);

  const setText = (next: string) => setTextState(next);

  const openList = (highlight: "first" | "last" | "selected" = "selected") => {
    if (isDisabled) return;
    setOpen(true);
    const pick =
      highlight === "last"
        ? enabled[enabled.length - 1]
        : highlight === "first"
          ? enabled[0]
          : (enabled.find((o) => selected.includes(o.value)) ?? enabled[0]);
    setActiveValue(pick?.value ?? null);
  };

  const close = () => {
    setOpen(false);
    setActiveValue(null);
    setTyping(false);
  };

  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    setKnown((prev) => (prev[option.value] === option.label ? prev : { ...prev, [option.value]: option.label }));
    if (multiple) {
      setSelected(selected.includes(option.value) ? selected.filter((v) => v !== option.value) : [...selected, option.value]);
      setText("");
      setTyping(false);
      setActiveValue(option.value);
    } else {
      setSelected([option.value]);
      setText(option.label);
      close();
    }
  };

  const remove = (v: string) => {
    setSelected(selected.filter((x) => x !== v));
    localInputRef.current?.focus();
  };

  // Single mode: leaving the field restores the selected label (or clears the value if the text was emptied).
  const restoreText = () => {
    if (multiple) {
      if (text !== "") setText("");
      return;
    }
    if (text.trim() === "") {
      if (selected.length > 0) setSelected([]);
    } else if (text !== singleLabel) {
      setText(singleLabel);
    }
  };

  useDismiss([contentRef, controlRef], isOpen, () => {
    close();
    restoreText();
  });

  // Keep the active option valid as results change.
  useEffect(() => {
    if (!isOpen) return;
    if (activeValue !== null && enabled.some((o) => o.value === activeValue)) return;
    setActiveValue(enabled[0]?.value ?? null);
  }, [isOpen, enabled, activeValue]);

  useEffect(() => {
    if (!isOpen || activeValue === null) return;
    document.getElementById(optionId(activeValue))?.scrollIntoView?.({ block: "nearest" });
  });

  const move = (delta: 1 | -1) => {
    if (!isOpen) {
      openList(delta === 1 ? "selected" : "last");
      return;
    }
    if (enabled.length === 0) return;
    const index = enabled.findIndex((o) => o.value === activeValue);
    const nextIndex = index === -1 ? (delta === 1 ? 0 : enabled.length - 1) : (index + delta + enabled.length) % enabled.length;
    setActiveValue(enabled[nextIndex]?.value ?? null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (event.altKey) openList();
        else move(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        if (event.altKey) close();
        else move(-1);
        return;
      case "Enter": {
        if (!isOpen) return;
        const option = enabled.find((o) => o.value === activeValue);
        if (option) {
          event.preventDefault();
          choose(option);
        }
        return;
      }
      case "Backspace":
        if (multiple && text === "" && selected.length > 0) {
          event.preventDefault();
          setSelected(selected.slice(0, -1));
        }
        return;
      case "Tab":
        if (isOpen) close();
        restoreText();
        return;
      default:
        return;
    }
  };

  const showStatus = loading || visible.length === 0;

  return (
    <div
      ref={ref}
      className={cx("mrd-combobox", className)}
      data-size={size}
      data-multiple={multiple || undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      data-state={isOpen ? "open" : "closed"}
      {...rest}
    >
      <div
        ref={controlRef}
        className="mrd-combobox__control"
        onPointerDown={(event) => {
          // Clicking the padding or a chip focuses the field instead of blurring it.
          if (event.target === event.currentTarget) {
            event.preventDefault();
            localInputRef.current?.focus();
          }
        }}
      >
        {multiple
          ? selected.map((v) => (
              <span key={v} className="mrd-combobox__chip">
                <span className="mrd-combobox__chip-label">{labelOf(v)}</span>
                <button
                  type="button"
                  tabIndex={-1}
                  className="mrd-combobox__chip-remove"
                  aria-label={getRemoveLabel(labelOf(v))}
                  disabled={isDisabled}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => remove(v)}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" focusable="false">
                    <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            ))
          : null}
        <input
          ref={composeRefs(localInputRef, inputRef)}
          id={controlId}
          type="text"
          role="combobox"
          className="mrd-combobox__input"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={isOpen && activeValue !== null ? optionId(activeValue) : undefined}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          placeholder={multiple && selected.length > 0 ? undefined : placeholder}
          value={text}
          {...wiring}
          onChange={(event) => {
            setText(event.currentTarget.value);
            setTyping(true);
            if (!isOpen) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onClick={() => {
            if (!isOpen) openList();
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          className="mrd-combobox__toggle"
          aria-label={toggleLabel}
          aria-expanded={isOpen}
          aria-controls={listboxId}
          disabled={isDisabled}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => {
            localInputRef.current?.focus();
            if (isOpen) close();
            else openList();
          }}
        >
          <ChevronIcon />
        </button>
      </div>
      <Portal container={container} scopeFrom={() => controlRef.current}>
        <div
          ref={composeRefs(contentRef, isOpen ? refs.setFloating : undefined)}
          className="mrd-combobox__content"
          hidden={!isOpen}
          data-state={isOpen ? "open" : "closed"}
          style={isOpen ? floatingStyles : undefined}
          onMouseDown={(event) => event.preventDefault()}
        >
          <div
            id={listboxId}
            role="listbox"
            aria-labelledby={labelledBy ?? controlId}
            aria-label={labelledBy ? undefined : ariaLabel}
            aria-multiselectable={multiple || undefined}
            aria-busy={loading || undefined}
            className="mrd-combobox__listbox"
          >
            {loading
              ? null
              : visible.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      id={optionId(option.value)}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      data-active={activeValue === option.value ? "" : undefined}
                      data-disabled={option.disabled ? "" : undefined}
                      className="mrd-combobox__item"
                      onClick={() => choose(option)}
                      onPointerMove={() => {
                        if (!option.disabled && activeValue !== option.value) setActiveValue(option.value);
                      }}
                    >
                      <span className="mrd-combobox__item-text">
                        <span className="mrd-combobox__item-label">{option.label}</span>
                        {option.description ? (
                          <span className="mrd-combobox__item-description">{option.description}</span>
                        ) : null}
                      </span>
                      {isSelected ? <CheckIcon /> : null}
                    </div>
                  );
                })}
          </div>
          {showStatus ? (
            <div className="mrd-combobox__status" role="status">
              {loading ? loadingMessage : emptyMessage}
            </div>
          ) : null}
        </div>
      </Portal>
      {name
        ? multiple
          ? selected.map((v) => <input key={v} type="hidden" name={name} value={v} disabled={isDisabled} />)
          : <input type="hidden" name={name} value={selected[0] ?? ""} disabled={isDisabled} />
        : null}
    </div>
  );
}

export const Combobox = withRef("Combobox", ComboboxImpl);
