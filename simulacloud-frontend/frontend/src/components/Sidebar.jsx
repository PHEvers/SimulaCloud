import { useState } from "react";
import { NavLink } from "react-router-dom";

const itensMenu = [
  { to: "/", label: "Home", icon: "⌂", end: true },
  { to: "/simulados", label: "Simulados", icon: "▤" },
  { to: "/perfil", label: "Perfil", icon: "◉" },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const fecharMenu = () => setMobileOpen(false);

  return (
    <>
      <div className="sidebar-mobile-bar">
        <button
          type="button"
          className="sidebar-toggle"
          aria-expanded={mobileOpen}
          aria-controls="simulacloud-sidebar-nav"
          onClick={() => setMobileOpen((aberto) => !aberto)}
        >
          <span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span>
          <span>{mobileOpen ? "Fechar menu" : "Menu"}</span>
        </button>
      </div>

      <aside
        id="simulacloud-sidebar-nav"
        className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}
        aria-label="Menu principal"
      >
        <div className="sidebar-section-label">MENU PRINCIPAL</div>
        <nav className="sidebar-nav">
          {itensMenu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={fecharMenu}
              className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
            >
              <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom-card">
          <span className="sidebar-bottom-eyebrow">SEU OBJETIVO</span>
          <strong>AWS Cloud Practitioner</strong>
          <span>CLF-C02 · Fundamentos da nuvem</span>
        </div>
      </aside>
      {mobileOpen && <button className="sidebar-backdrop" aria-label="Fechar menu" onClick={fecharMenu} />}
    </>
  );
}
