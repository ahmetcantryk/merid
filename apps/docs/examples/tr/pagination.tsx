"use client";

import { useState } from "react";
import { Pagination } from "@merid/react";

const trLabels = {
  "aria-label": "Sayfalama",
  previousLabel: "Önceki sayfa",
  nextLabel: "Sonraki sayfa",
  pageLabel: (p: number) => `Sayfa ${p}`,
};

export function PaginationBasic() {
  return <Pagination pageCount={12} defaultPage={5} {...trLabels} />;
}

export function PaginationControlled() {
  const [page, setPage] = useState(1);
  return (
    <div>
      <p>
        {(page - 1) * 20 + 1}–{page * 20} arası sonuçlar gösteriliyor
      </p>
      <Pagination pageCount={8} page={page} onPageChange={setPage} {...trLabels} />
    </div>
  );
}

export function PaginationSiblings() {
  return <Pagination pageCount={40} defaultPage={20} siblingCount={2} {...trLabels} />;
}

export function PaginationLinks() {
  return (
    <Pagination
      pageCount={6}
      defaultPage={2}
      getHref={(page) => `?page=${page}`}
      {...trLabels}
      aria-label="Arama sonucu sayfaları"
    />
  );
}
