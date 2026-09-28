"use client";

import { useState } from "react";
import { Pagination } from "@merid/react";

export function PaginationBasic() {
  return <Pagination pageCount={12} defaultPage={5} />;
}

export function PaginationControlled() {
  const [page, setPage] = useState(1);
  return (
    <div>
      <p>
        Showing results {(page - 1) * 20 + 1}–{page * 20}
      </p>
      <Pagination pageCount={8} page={page} onPageChange={setPage} />
    </div>
  );
}

export function PaginationSiblings() {
  return <Pagination pageCount={40} defaultPage={20} siblingCount={2} />;
}

export function PaginationLinks() {
  return (
    <Pagination
      pageCount={6}
      defaultPage={2}
      getHref={(page) => `?page=${page}`}
      aria-label="Search results pages"
    />
  );
}
