import { CATEGORY_OPTIONS, STATUS_OPTIONS, SORT_OPTIONS } from "../../lib/constants.js";

export default function ProductFilters({ filters, onChange }) {
  function update(patch) {
    onChange({ ...filters, ...patch, page: 1 });
  }

  return (
    <div className="product-filters">
      <div className="field">
        <label htmlFor="filter-category">Category</label>
        <select
          id="filter-category"
          value={filters.category || ""}
          onChange={(e) => update({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          value={filters.status || ""}
          onChange={(e) => update({ status: e.target.value })}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="filter-sortBy">Sort by</label>
        <select
          id="filter-sortBy"
          value={filters.sortBy || "createdAt"}
          onChange={(e) => update({ sortBy: e.target.value })}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="filter-sortOrder">Order</label>
        <select
          id="filter-sortOrder"
          value={filters.sortOrder || "desc"}
          onChange={(e) => update({ sortOrder: e.target.value })}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() =>
          onChange({
            search: filters.search || "",
            category: "",
            status: "",
            sortBy: "createdAt",
            sortOrder: "desc",
            page: 1,
            pageSize: filters.pageSize,
          })
        }
      >
        Reset filters
      </button>
    </div>
  );
}
