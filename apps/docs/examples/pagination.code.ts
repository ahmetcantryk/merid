// Source strings shown in the docs code tabs. Kept out of the client module so server components can read them.

export const paginationBasicCode = `import { Pagination } from "@merid/react";

export function Example() {
  return <Pagination pageCount={12} defaultPage={5} />;
}`;


export const paginationControlledCode = `import { useState } from "react";
import { Pagination } from "@merid/react";

export function Example() {
  const [page, setPage] = useState(1);
  return (
    <div>
      <p>Showing results {(page - 1) * 20 + 1}–{page * 20}</p>
      <Pagination pageCount={8} page={page} onPageChange={setPage} />
    </div>
  );
}`;


export const paginationSiblingsCode = `<Pagination pageCount={40} defaultPage={20} siblingCount={2} />`;


export const paginationLinksCode = `<Pagination
  pageCount={6}
  defaultPage={2}
  getHref={(page) => \`?page=\${page}\`}
  aria-label="Search results pages"
/>`;
