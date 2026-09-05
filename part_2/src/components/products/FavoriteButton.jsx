import { Star } from "lucide-react";
import { useFavoritesStore } from "../../store/useFavoritesStore.js";

const SIZE_MAP = { sm: 16, md: 18, lg: 24 };

export default function FavoriteButton({ productId, size = "md" }) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(productId));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <button
      type="button"
      className={`favorite-btn favorite-btn-${size} ${isFavorite ? "is-favorite" : ""}`}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleFavorite(productId);
      }}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        size={SIZE_MAP[size] || 18}
        fill={isFavorite ? "currentColor" : "none"}
        aria-hidden="true"
      />
    </button>
  );
}
