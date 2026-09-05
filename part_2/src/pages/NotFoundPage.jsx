import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="page not-found-page">
      <SearchX size={40} className="state-icon" aria-hidden="true" />
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/products" className="btn btn-primary">
        Back to products
      </Link>
    </div>
  );
}
