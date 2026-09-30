// Source strings shown in the docs code tabs. Kept out of the client module so server components can read them.

export const paginationBasicCode = `import { Pagination } from "@meridui/react";

export function Example() {
  return (
    <Pagination
      pageCount={12}
      defaultPage={5}
      aria-label="Sayfalama"
      previousLabel="Önceki sayfa"
      nextLabel="Sonraki sayfa"
      pageLabel={(p) => \`Sayfa \${p}\`}
    />
  );
}`;


export const paginationControlledCode = `import { useState } from "react";
import { Pagination } from "@meridui/react";

export function Example() {
  const [page, setPage] = useState(1);
  return (
    <div>
      <p>{(page - 1) * 20 + 1}–{page * 20} arası sonuçlar gösteriliyor</p>
      <Pagination
        pageCount={8}
        page={page}
        onPageChange={setPage}
        aria-label="Sayfalama"
        previousLabel="Önceki sayfa"
        nextLabel="Sonraki sayfa"
        pageLabel={(p) => \`Sayfa \${p}\`}
      />
    </div>
  );
}`;


export const paginationSiblingsCode = `<Pagination
  pageCount={40}
  defaultPage={20}
  siblingCount={2}
  aria-label="Sayfalama"
  previousLabel="Önceki sayfa"
  nextLabel="Sonraki sayfa"
  pageLabel={(p) => \`Sayfa \${p}\`}
/>`;


export const paginationLinksCode = `<Pagination
  pageCount={6}
  defaultPage={2}
  getHref={(page) => \`?page=\${page}\`}
  aria-label="Arama sonucu sayfaları"
  previousLabel="Önceki sayfa"
  nextLabel="Sonraki sayfa"
  pageLabel={(p) => \`Sayfa \${p}\`}
/>`;
