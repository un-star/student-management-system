import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-md font-body text-sm tracking-wide transition-colors ${
      isActive ? "bg-brass text-ink font-semibold" : "text-paper/80 hover:bg-inklight"
    }`;

  return (
    <aside className="w-60 min-h-screen bg-ink flex flex-col py-8 px-4">
      <h1 className="font-display text-2xl text-paper mb-1 px-4">Registrar</h1>
      <p className="text-paper/50 text-xs px-4 mb-8 font-mono">
        {user ? user.role.toUpperCase() : ""}
      </p>

      <nav className="flex flex-col gap-2 flex-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/students" className={linkClass}>Students</NavLink>
      </nav>

      <button
        onClick={logout}
        className="mx-4 mt-8 text-left text-danger/90 hover:text-danger text-sm font-medium"
      >
        Log out
      </button>
    </aside>
  );
}
