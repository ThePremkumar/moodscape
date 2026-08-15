import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar" id="main-navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="logo-icon">🎨</span>
        <span>MoodScape</span>
      </NavLink>

      <ul className="navbar-links">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            id="nav-create"
          >
            ✨ Create
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/timeline"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            id="nav-timeline"
          >
            📜 Timeline
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            id="nav-analytics"
          >
            📊 Analytics
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
