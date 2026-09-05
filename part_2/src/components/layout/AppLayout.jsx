import { useState } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import { useApiStatusStore } from "../../store/useApiStatusStore.js";

export default function AppLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const usingMock = useApiStatusStore((s) => s.usingMock);

  return (
    <div className="app-shell">
      <Header onToggleSidebar={() => setMobileNavOpen((v) => !v)} />
      <div className="app-body">
        <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
        <main className="app-content">
          {usingMock && (
            <div className="mock-banner" role="status">
              Couldn't reach the hosted API — showing local demo data instead. Data you
              create/edit/delete here is saved in your browser only.
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
