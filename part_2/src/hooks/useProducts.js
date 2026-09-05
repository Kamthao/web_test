import { useMutation, useQueries, useQueryClient, useQuery } from "@tanstack/react-query";
import * as api from "../api/products.js";

export function useProductsQuery(params) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => api.fetchProducts(params),
    placeholderData: (previousData) => previousData, // keep old page while loading next
  });
}

export function useProductQuery(id) {
  return useQuery({
    queryKey: ["product", String(id)],
    queryFn: () => api.fetchProduct(id),
    enabled: Boolean(id),
  });
}

// Used by the Favorites / Recently viewed page to fetch several products by id.
export function useProductsByIds(ids = []) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ["product", String(id)],
      queryFn: () => api.fetchProduct(id),
      staleTime: 60_000,
      retry: false,
    })),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateProduct(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", String(variables.id)] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
