"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface TocItem {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
}

export function OnThisPage() {
  const pathname = usePathname();
  const [items, setItems] = useState<readonly TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLHeadingElement>(".doc-article h2[id], .doc-article h3[id]"));
    setItems(
      headings.map((h) => ({ id: h.id, text: h.textContent ?? "", level: h.tagName === "H2" ? 2 : 3 })),
    );
    setActiveId(headings[0]?.id ?? null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -65% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [pathname]);

  if (items.length < 2) return <aside className="docs-toc" aria-hidden="true" />;

  return (
    <aside className="docs-toc">
      <nav aria-label="On this page">
        <p className="docs-toc__heading">On this page</p>
        <ul>
          {items.map((item) => (
            <li key={item.id} data-level={item.level}>
              <a href={`#${item.id}`} aria-current={item.id === activeId ? "location" : undefined}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
