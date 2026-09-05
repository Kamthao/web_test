// Single entry point the rest of the app talks to for product data.
//
// Why this file exists: the assignment's hosted API (https://187.127.214.49)
// is not always reachable from every network (self-signed cert / firewall /
// the shared instance being down). Rather than blocking all UI development
// and review on that, this module can run against:
//
//   - "live"  → always call the real hosted API, never fall back
//   - "mock"  → always use local mock data (works fully offline)
//   - "auto"  → try the real API first; if it fails to connect at all
//               (network/CORS/cert error → ApiError.status === 0), silently
//               fall back to mock data for that call and flag the UI banner.
//
// Configure with VITE_API_MODE in .env (defaults to "auto").

import { apiClient, ApiError } from "./client.js";
import {
  mockFetchProducts,
  mockFetchProduct,
  mockCreateProduct,
  mockUpdateProduct,
  mockDeleteProduct,
} from "./mockDb.js";
import { useApiStatusStore } from "../store/useApiStatusStore.js";

const MODE = (import.meta.env.VITE_API_MODE || "auto").toLowerCase();

function markMock(isMock) {
  // Only ever flips true→ once we detect the live API is unreachable;
  // we don't flip it back to false mid-session to avoid a flickering banner.
  if (isMock) useApiStatusStore.getState().setUsingMock(true);
}

function isUnreachable(err) {
  return err instanceof ApiError && err.status === 0;
}

function buildQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      usp.set(key, value);
    }
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

async function withFallback(liveCall, mockCall) {
  if (MODE === "mock") return mockCall();
  if (MODE === "live") return liveCall();

  // auto: once we've confirmed the live API is unreachable this session,
  // skip straight to mock instead of re-trying (and re-timing-out) the
  // live call on every single request.
  if (useApiStatusStore.getState().usingMock) return mockCall();

  try {
    return await liveCall();
  } catch (err) {
    if (isUnreachable(err)) {
      markMock(true);
      return mockCall();
    }
    throw err;
  }
}

export function fetchProducts(params) {
  return withFallback(
    () => apiClient.get(`/products${buildQuery(params)}`),
    () => mockFetchProducts(params)
  );
}

export function fetchProduct(id) {
  return withFallback(
    () => apiClient.get(`/products/${id}`),
    () => mockFetchProduct(id)
  );
}

export function createProduct(payload) {
  return withFallback(
    () => apiClient.post("/products", payload),
    () => mockCreateProduct(payload)
  );
}

export function updateProduct(id, payload) {
  return withFallback(
    () => apiClient.put(`/products/${id}`, payload),
    () => mockUpdateProduct(id, payload)
  );
}

export function deleteProduct(id) {
  return withFallback(
    () => apiClient.delete(`/products/${id}`),
    () => mockDeleteProduct(id)
  );
}
