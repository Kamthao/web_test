import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/products/ProductForm.jsx";
import Spinner from "../components/common/Spinner.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useProductQuery, useUpdateProduct } from "../hooks/useProducts.js";

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error, refetch } = useProductQuery(id);
  const updateProduct = useUpdateProduct();
  const [apiError, setApiError] = useState(null);

  if (isLoading) return <Spinner label="Loading product…" />;
  if (isError) {
    return (
      <ErrorState title="Couldn't load this product" message={error?.message} onRetry={refetch} />
    );
  }
  if (!product) return null;

  function handleSubmit(values) {
    setApiError(null);
    updateProduct.mutate(
      { id: product.id, data: values },
      {
        onSuccess: () => navigate(`/products/${product.id}`),
        onError: (err) => setApiError(err?.message || "Something went wrong. Please try again."),
      }
    );
  }

  return (
    <div className="page">
      <h1>Edit product</h1>
      <ProductForm
        defaultValues={{
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          status: product.status,
          description: product.description || "",
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateProduct.isPending}
        submitLabel="Save changes"
        apiError={apiError}
      />
    </div>
  );
}
