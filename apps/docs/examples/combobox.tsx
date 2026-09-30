"use client";

import { useEffect, useRef, useState } from "react";
import { Combobox, Field, type ComboboxOption } from "@meridui/react";

const stack = { display: "grid", gap: 8, width: 300 } as const;

const frameworks: ComboboxOption[] = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "vite", label: "Vite" },
  { value: "gatsby", label: "Gatsby", disabled: true },
  { value: "nuxt", label: "Nuxt", description: "Vue" },
  { value: "sveltekit", label: "SvelteKit", description: "Svelte" },
];

export function ComboboxBasic() {
  return (
    <div style={stack}>
      <Field label="Framework">
        <Combobox options={frameworks} placeholder="Search frameworks…" name="framework" />
      </Field>
    </div>
  );
}

export function ComboboxMultiple() {
  const [value, setValue] = useState<string[]>(["next", "vite"]);
  return (
    <div style={stack}>
      <Field label="Stack" description="Pick any number.">
        <Combobox multiple options={frameworks} value={value} onValueChange={setValue} placeholder="Add…" />
      </Field>
      <span style={{ fontSize: 13, color: "var(--mrd-muted)" }}>value: {JSON.stringify(value)}</span>
    </div>
  );
}

const CITIES = ["Amsterdam", "Ankara", "Athens", "Berlin", "Istanbul", "Izmir", "Lisbon", "London", "Madrid", "Paris", "Prague", "Rome", "Vienna"];

/** Stand-in for a server search: resolves after a short delay. */
function searchCities(text: string): Promise<ComboboxOption[]> {
  const query = text.trim().toLowerCase();
  return new Promise((resolve) =>
    setTimeout(
      () => resolve(CITIES.filter((c) => c.toLowerCase().includes(query)).map((c) => ({ value: c.toLowerCase(), label: c }))),
      400,
    ),
  );
}

export function ComboboxAsync() {
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  const request = useRef(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const id = ++request.current;
    if (text.trim() === "") return;
    const timer = setTimeout(() => {
      setLoading(true);
      searchCities(text).then((result) => {
        if (id !== request.current) return;
        setOptions(result);
        setLoading(false);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div style={stack}>
      <Field label="City">
        <Combobox
          options={text.trim() === "" ? [] : options}
          filter={false}
          loading={loading}
          onInputValueChange={setText}
          placeholder="Type to search…"
          emptyMessage={text.trim() === "" ? "Start typing" : "No cities found"}
        />
      </Field>
    </div>
  );
}

export function ComboboxStates() {
  return (
    <div style={stack}>
      <Combobox aria-label="Small" size="sm" options={frameworks} placeholder="Small" />
      <Combobox aria-label="Invalid" invalid options={frameworks} placeholder="Invalid" />
      <Combobox aria-label="Disabled" disabled options={frameworks} defaultValue="astro" />
    </div>
  );
}
