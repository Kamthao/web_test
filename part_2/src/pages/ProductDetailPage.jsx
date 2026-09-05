import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/common/Spinner.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import StatusBadge from "../components/products/StatusBadge.jsx";
import FavoriteButton from "../components/products/FavoriteButton.jsx";
import { useProductQuery, useDeleteProduct } from "../hooks/useProducts.js";
import { useFavoritesStore } from "../store/useFavoritesStore.js";
import { formatCurrency, formatDate } from "../lib/utils.js";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error, refetch } = useProductQuery(id);
  const deleteProduct = useDeleteProduct();
  const addRecentlyViewed = useFavoritesStore((s) => s.addRecentlyViewed);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (product?.id) addRecentlyViewed(product.id);
  }, [product?.id, addRecentlyViewed]);

  if (isLoading) return <Spinner label="Loading product…" />;
  if (isError) {
    return (
      <ErrorState
        title="Couldn't load this product"
        message={error?.message}
        onRetry={refetch}
      />
    );
  }
  if (!product) return null;

  function handleDelete() {
    deleteProduct.mutate(product.id, {
      onSuccess: () => navigate("/products"),
    });
  }

  return (
    <div className="page">
      <Link to="/products" className="back-link">
        ← Back to products
      </Link>

      <div className="detail-card">
        <div className="detail-header">
          <h1>{product.name}</h1>
          <FavoriteButton productId={product.id} size="lg" />
        </div>

        <div className="detail-grid">
          <div>
            <span className="detail-label">Category</span>
            <span>{product.category}</span>
          </div>
          <div>
            <span className="detail-label">Price</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
          <div>
            <span className="detail-label">Stock</span>
            <span>{product.stock}</span>
          </div>
          <div>
            <span className="detail-label">Status</span>
            <StatusBadge status={product.status} />
          </div>
          <div>
            <span className="detail-label">Created</span>
            <span>{formatDate(product.createdAt)}</span>
          </div>
        </div>

        {product.description && (
          <div className="detail-description">
            <span className="detail-label">Description</span>
            <p>{product.description}</p>
          </div>
        )}

        <div className="detail-actions">
          <Link to={`/products/${product.id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete product?"
        description={`This will permanently delete "${product.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={deleteProduct.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
