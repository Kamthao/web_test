import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/products/ProductForm.jsx";
import { useCreateProduct } from "../hooks/useProducts.js";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const [apiError, setApiError] = useState(null);

  function handleSubmit(values) {
    setApiError(null);
    createProduct.mutate(values, {
      onSuccess: (product) => navigate(`/products/${product.id}`),
      onError: (err) => {
        if (err?.errors) {
          // Field-level errors are shown inline in the form on refetch/validation;
          // here we just surface a general message since react-hook-form already
          // validated the shape client-side.
          setApiError(err.message || "Please check the highlighted fields.");
        } else {
          setApiError(err?.message || "Something went wrong. Please try again.");
        }
      },
    });
  }

  return (
    <div className="page">
      <h1>New product</h1>
      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={createProduct.isPending}
        submitLabel="Create product"
        apiError={apiError}
      />
    </div>
  );
}
