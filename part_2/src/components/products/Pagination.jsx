import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" disabled={!canPrev} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft size={16} aria-hidden="true" />
        <span>Prev</span>
      </button>
      {start > 1 && <span className="pagination-ellipsis">…</span>}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={p === page ? "is-current" : ""}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </button>
      ))}
      {end < totalPages && <span className="pagination-ellipsis">…</span>}
      <button type="button" disabled={!canNext} onClick={() => onChange(page + 1)} aria-label="Next page">
        <span>Next</span>
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
