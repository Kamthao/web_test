import { NavLink } from "react-router-dom";
import { Package, Star, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useUIStore } from "../../store/useUIStore.js";

const NAV_ITEMS = [
  { to: "/products", label: "Products", icon: Package },
  { to: "/favorites", label: "Favorites & Recent", icon: Star },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <>
      <aside
        className={[
          "app-sidebar",
          collapsed ? "is-collapsed" : "",
          mobileOpen ? "is-mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <nav>
          <ul>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={onCloseMobile}
                    title={item.label}
                  >
                    <Icon size={18} className="nav-icon" aria-hidden="true" />
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight size={16} aria-hidden="true" />
          ) : (
            <>
              <ChevronsLeft size={16} aria-hidden="true" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </aside>

      {mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}
    </>
  );
}
