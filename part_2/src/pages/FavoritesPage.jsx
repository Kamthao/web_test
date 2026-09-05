import { Link } from "react-router-dom";
import { useFavoritesStore } from "../store/useFavoritesStore.js";
import { useProductsByIds } from "../hooks/useProducts.js";
import FavoriteButton from "../components/products/FavoriteButton.jsx";
import StatusBadge from "../components/products/StatusBadge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { formatCurrency } from "../lib/utils.js";

function ProductMiniCard({ result, id }) {
  if (result.isLoading) {
    return <li className="mini-card mini-card-loading">Loading…</li>;
  }
  if (result.isError || !result.data) {
    // Product may have been deleted since it was viewed/favorited — skip quietly.
    return null;
  }
  const product = result.data;
  return (
    <li className="mini-card">
      <Link to={`/products/${id}`} className="mini-card-link">
        <div className="mini-card-top">
          <span className="mini-card-name">{product.name}</span>
          <FavoriteButton productId={product.id} />
        </div>
        <div className="mini-card-meta">
          <span>{product.category}</span>
          <span>{formatCurrency(product.price)}</span>
          <StatusBadge status={product.status} />
        </div>
      </Link>
    </li>
  );
}

export default function FavoritesPage() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const recentlyViewed = useFavoritesStore((s) => s.recentlyViewed);
  const clearRecentlyViewed = useFavoritesStore((s) => s.clearRecentlyViewed);

  const favoriteResults = useProductsByIds(favorites);
  const recentResults = useProductsByIds(recentlyViewed);

  return (
    <div className="page">
      <h1>Favorites &amp; Recently Viewed</h1>

      <section className="page-section">
        <h2>Favorites ({favorites.length})</h2>
        {favorites.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            description={
              <>
                Tap the ☆ on any product to save it here.
              </>
            }
          />
        ) : (
          <ul className="mini-card-grid">
            {favorites.map((id, index) => (
              <ProductMiniCard key={id} id={id} result={favoriteResults[index]} />
            ))}
          </ul>
        )}
      </section>

      <section className="page-section">
        <div className="page-section-header">
          <h2>Recently viewed ({recentlyViewed.length})</h2>
          {recentlyViewed.length > 0 && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={clearRecentlyViewed}>
              Clear
            </button>
          )}
        </div>
        {recentlyViewed.length === 0 ? (
          <EmptyState
            title="No recently viewed products"
            description="Products you open will show up here."
          />
        ) : (
          <ul className="mini-card-grid">
            {recentlyViewed.map((id, index) => (
              <ProductMiniCard key={id} id={id} result={recentResults[index]} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
