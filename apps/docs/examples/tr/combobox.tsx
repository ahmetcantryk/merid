"use client";

import { useEffect, useRef, useState } from "react";
import { Combobox, Field, type ComboboxOption } from "@meridui/react";

const stack = { display: "grid", gap: 8, width: 300 } as const;

/** Türkçe arayüz metinleri; ekran okuyucu etiketleri de dahil. */
const tr = {
  emptyMessage: "Sonuç yok",
  loadingMessage: "Yükleniyor…",
  toggleLabel: "Seçenekleri göster",
  getRemoveLabel: (label: string) => `${label} öğesini kaldır`,
  locale: "tr-TR",
} as const;

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
        <Combobox {...tr} options={frameworks} placeholder="Framework ara…" name="framework" />
      </Field>
    </div>
  );
}

export function ComboboxMultiple() {
  const [value, setValue] = useState<string[]>(["next", "vite"]);
  return (
    <div style={stack}>
      <Field label="Teknoloji yığını" description="İstediğin kadar seç.">
        <Combobox {...tr} multiple options={frameworks} value={value} onValueChange={setValue} placeholder="Ekle…" />
      </Field>
      <span style={{ fontSize: 13, color: "var(--mrd-muted)" }}>değer: {JSON.stringify(value)}</span>
    </div>
  );
}

const CITIES = ["Adana", "Ankara", "Antalya", "Bursa", "Eskişehir", "İstanbul", "İzmir", "Kayseri", "Konya", "Mersin", "Samsun", "Trabzon"];

/** Sunucu aramasının yerine geçer: kısa bir gecikmeyle sonuç döndürür. */
function searchCities(text: string): Promise<ComboboxOption[]> {
  const query = text.trim().toLocaleLowerCase("tr-TR");
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          CITIES.filter((c) => c.toLocaleLowerCase("tr-TR").includes(query)).map((c) => ({
            value: c.toLocaleLowerCase("tr-TR"),
            label: c,
          })),
        ),
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
      <Field label="Şehir">
        <Combobox
          {...tr}
          options={text.trim() === "" ? [] : options}
          filter={false}
          loading={loading}
          onInputValueChange={setText}
          placeholder="Aramak için yaz…"
          emptyMessage={text.trim() === "" ? "Yazmaya başla" : "Şehir bulunamadı"}
        />
      </Field>
    </div>
  );
}

export function ComboboxStates() {
  return (
    <div style={stack}>
      <Combobox {...tr} aria-label="Küçük" size="sm" options={frameworks} placeholder="Küçük" />
      <Combobox {...tr} aria-label="Geçersiz" invalid options={frameworks} placeholder="Geçersiz" />
      <Combobox {...tr} aria-label="Devre dışı" disabled options={frameworks} defaultValue="astro" />
    </div>
  );
}
