import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, Search } from "lucide-react";

export default function Header({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    navigate(`/products?${params.toString()}`);
  }

  return (
    <header className="app-header">
      <button
        type="button"
        className="icon-btn sidebar-toggle"
        aria-label="Toggle navigation"
        onClick={onToggleSidebar}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      <Link to="/products" className="app-logo">
        Product <span>Admin</span>
      </Link>

      <form className="header-search" role="search" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search products by name…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Search products"
        />
        <button type="submit" aria-label="Search">
          <Search size={16} aria-hidden="true" />
          <span>Search</span>
        </button>
      </form>
    </header>
  );
}
