import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import FavoriteButton from "./FavoriteButton.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { formatCurrency, formatDate } from "../../lib/utils.js";
import { useDeleteProduct } from "../../hooks/useProducts.js";

export default function ProductTable({ products }) {
  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct();
  const [pendingDelete, setPendingDelete] = useState(null); // product or null

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteProduct.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  }

  return (
    <>
      <div className="table-scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th aria-label="Favorite" />
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Created</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="product-row"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <FavoriteButton productId={product.id} />
                </td>
                <td className="cell-name">{product.name}</td>
                <td>{product.category}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <StatusBadge status={product.status} />
                </td>
                <td>{formatDate(product.createdAt)}</td>
                <td className="cell-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="icon-btn-action"
                    aria-label={`View ${product.name}`}
                    title="View"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <Eye size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn-action"
                    aria-label={`Edit ${product.name}`}
                    title="Edit"
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn-action is-danger"
                    aria-label={`Delete ${product.name}`}
                    title="Delete"
                    onClick={() => setPendingDelete(product)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete product?"
        description={
          pendingDelete
            ? `This will permanently delete "${pendingDelete.name}". This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        isConfirming={deleteProduct.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
