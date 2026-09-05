import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters."),
  category: z.string().min(1, "Category is required."),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .gt(0, "Price must be greater than 0."),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number." })
    .int("Stock must be a whole number.")
    .min(0, "Stock must be 0 or greater."),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be active or inactive." }),
  }),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters.")
    .optional()
    .or(z.literal("")),
});

export const productFormDefaults = {
  name: "",
  category: "",
  price: "",
  stock: "",
  status: "active",
  description: "",
};
