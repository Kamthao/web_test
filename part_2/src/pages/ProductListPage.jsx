import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ProductFilters from "../components/products/ProductFilters.jsx";
import ProductTable from "../components/products/ProductTable.jsx";
import Pagination from "../components/products/Pagination.jsx";
import Spinner from "../components/common/Spinner.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Button from "../components/common/Button.jsx";
import { useProductsQuery } from "../hooks/useProducts.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { DEFAULT_PAGE_SIZE } from "../lib/constants.js";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      status: searchParams.get("status") || "",
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE,
    }),
    [searchParams]
  );

  // Header already writes ?search= on submit; debounce here mainly protects
  // against fast successive filter/sort changes triggering extra requests.
  const debouncedSearch = useDebounce(filters.search, 300);
  const queryParams = { ...filters, search: debouncedSearch };

  const { data, isLoading, isError, error, refetch, isFetching } = useProductsQuery(queryParams);

  function updateFilters(nextFilters) {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Products</h1>
        <Button as={Link} to="/products/new" variant="primary">
          + New product
        </Button>
      </div>

      <ProductFilters filters={filters} onChange={updateFilters} />

      {isLoading ? (
        <Spinner label="Loading products…" />
      ) : isError ? (
        <ErrorState
          title="Couldn't load products"
          message={error?.message}
          onRetry={refetch}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filters."
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateFilters({
                  search: "",
                  category: "",
                  status: "",
                  sortBy: "createdAt",
                  sortOrder: "desc",
                  page: 1,
                  pageSize: filters.pageSize,
                })
              }
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <ProductTable products={products} />
          {isFetching && <p className="muted-note">Refreshing…</p>}
          <Pagination
            page={meta?.page || 1}
            totalPages={meta?.totalPages || 1}
            onChange={(page) => updateFilters({ ...filters, page })}
          />
        </>
      )}
    </div>
  );
}
