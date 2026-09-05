import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 10;

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      recentlyViewed: [],

      isFavorite: (id) => get().favorites.some((f) => String(f) === String(id)),

      toggleFavorite: (id) =>
        set((state) => {
          const exists = state.favorites.some((f) => String(f) === String(id));
          return {
            favorites: exists
              ? state.favorites.filter((f) => String(f) !== String(id))
              : [...state.favorites, id],
          };
        }),

      addRecentlyViewed: (id) =>
        set((state) => {
          const next = [id, ...state.recentlyViewed.filter((r) => String(r) !== String(id))];
          return { recentlyViewed: next.slice(0, MAX_RECENT) };
        }),

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
    }),
    {
      name: "aivinix-product-admin-favorites", // localStorage key
      version: 1,
      // Guard against a corrupted / hand-edited localStorage value.
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyViewed: state.recentlyViewed,
      }),
      merge: (persisted, current) => {
        const safe = persisted && typeof persisted === "object" ? persisted : {};
        return {
          ...current,
          favorites: Array.isArray(safe.favorites) ? safe.favorites : [],
          recentlyViewed: Array.isArray(safe.recentlyViewed) ? safe.recentlyViewed : [],
        };
      },
    }
  )
);
