"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useDictionary, useLocale } from "@/lib/i18n/client";
import { localizePath } from "@/lib/i18n/config";
import { searchIndex, type SearchEntry } from "@/lib/search";

export function SearchDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const listId = useId();
  const [entries, setEntries] = useState<readonly SearchEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [isMac, setIsMac] = useState(true);
  const locale = useLocale();
  const t = useDictionary().search;

  const results = useMemo(() => (entries ? searchIndex(entries, query) : []), [entries, query]);

  const load = useCallback(async () => {
    if (entries) return;
    try {
      const response = await fetch(localizePath("/search-index.json", locale));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setEntries((await response.json()) as SearchEntry[]);
    } catch (err) {
      console.error("[docs] search index failed to load", err);
      setError(true);
    }
  }, [entries, locale]);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setQuery("");
    setActive(0);
    void load();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [load]);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    function onKey(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // `?q=` (the WebSite SearchAction target) opens the dialog with the query filled in.
  const queryHandled = useRef(false);
  useEffect(() => {
    if (queryHandled.current) return;
    queryHandled.current = true;
    const q = new URLSearchParams(window.location.search).get("q")?.trim();
    if (!q) return;
    open();
    setQuery(q.slice(0, 100));
  }, [open]);

  function go(entry: SearchEntry | undefined) {
    if (!entry) return;
    dialogRef.current?.close();
    router.push(entry.href);
  }

  function onInputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  }

  return (
    <>
      <button type="button" className="search-trigger" onClick={open} aria-haspopup="dialog" aria-label={t.trigger}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="search-trigger__label">{t.trigger}</span>
        <kbd className="search-trigger__kbd">{isMac ? "⌘K" : "Ctrl K"}</kbd>
      </button>
      <dialog
        ref={dialogRef}
        className="search-dialog"
        aria-label={t.dialogLabel}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <div className="search-dialog__field">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            placeholder={t.placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
          />
          <kbd>Esc</kbd>
        </div>
        <ul id={listId} role="listbox" className="search-dialog__list" aria-label={t.results}>
          {results.map((entry, index) => (
            <li
              key={entry.href}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              className="search-dialog__item"
              onMouseMove={() => setActive(index)}
              onClick={() => go(entry)}
            >
              <span className="search-dialog__title">{entry.title}</span>
              <span className="search-dialog__meta">{entry.section ? `${entry.page} · ${entry.group}` : entry.group}</span>
            </li>
          ))}
        </ul>
        {error ? <p className="search-dialog__empty">{t.loadError}</p> : null}
        {!error && entries && query.trim() && results.length === 0 ? (
          <p className="search-dialog__empty">{t.noResults(query.trim())}</p>
        ) : null}
        <p className="search-dialog__hint">
          <kbd>↑</kbd> <kbd>↓</kbd> {t.hintMove} <kbd>Enter</kbd> {t.hintOpen}
        </p>
      </dialog>
    </>
  );
}
