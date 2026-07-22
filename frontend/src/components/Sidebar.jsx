import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-xl font-body text-sm tracking-wide transition-colors ${
      isActive
        ? "bg-brass text-ink font-semibold shadow-sm"
        : "text-paper/85 hover:bg-inklight/80 hover:text-paper"
    }`;

  return (
    <aside className="w-full lg:w-72 min-h-0 lg:min-h-screen bg-ink flex flex-col gap-4 p-4 sm:p-6 lg:py-8 lg:px-4 lg:sticky lg:top-0">
      <div className="px-2 sm:px-4">
        {/* This small block gives the sidebar a clear identity on all screen sizes. */}
        <h1 className="font-display text-2xl text-paper mb-1">Registrar</h1>
        <p className="text-paper/55 text-xs font-mono">
          {user ? user.role.toUpperCase() : ""}
        </p>
      </div>

      {/* On mobile the links wrap into rows; on desktop they stack vertically. */}
      <nav className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/students" className={linkClass}>
          Students
        </NavLink>
        <NavLink to="/attendance" className={linkClass}>
          Attendance
        </NavLink>
        <NavLink to="/marks" className={linkClass}>
          Marks
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className="mt-auto mx-1 sm:mx-2 rounded-xl border border-white/10 px-4 py-3 text-left text-danger/90 hover:text-danger hover:bg-white/5 text-sm font-medium transition-colors"
      >
        Log out
      </button>
    </aside>
  );
}
