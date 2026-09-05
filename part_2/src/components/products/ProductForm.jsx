import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { productSchema, productFormDefaults } from "../../lib/validation.js";
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "../../lib/constants.js";

export default function ProductForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save product",
  apiError,
}) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || productFormDefaults,
  });

  return (
    <form className="product-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {apiError && <div className="form-api-error">{apiError}</div>}

      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register("name")} aria-invalid={Boolean(errors.name)} />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" {...register("category")} aria-invalid={Boolean(errors.category)}>
          <option value="">Select a category…</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && <p className="field-error">{errors.category.message}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">Price (USD)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price")}
            aria-invalid={Boolean(errors.price)}
          />
          {errors.price && <p className="field-error">{errors.price.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            type="number"
            step="1"
            min="0"
            {...register("stock")}
            aria-invalid={Boolean(errors.stock)}
          />
          {errors.stock && <p className="field-error">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="status">Status</label>
        <select id="status" {...register("status")} aria-invalid={Boolean(errors.status)}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {errors.status && <p className="field-error">{errors.status.message}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          rows={4}
          maxLength={500}
          {...register("description")}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && <p className="field-error">{errors.description.message}</p>}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={isSubmitting}
          onClick={() => (isDirty ? reset(defaultValues || productFormDefaults) : navigate(-1))}
        >
          {isDirty ? "Reset" : "Cancel"}
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
