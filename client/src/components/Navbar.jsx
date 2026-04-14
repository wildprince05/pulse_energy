import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition ${
          isActive ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white hover:bg-white/5"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { isAuthed, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-pulse.cyan via-pulse.pink to-pulse.lime" />
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-wide">Pulse Energy</div>
            <div className="text-xs text-zinc-400">Fuel your next move</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/products">Products</NavItem>
          {isAuthed ? (
            <>
              <span className="hidden sm:inline px-3 text-xs text-zinc-400">
                Signed in as <span className="text-zinc-200">{user?.email}</span>
              </span>
              <button
                onClick={logout}
                className="ml-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <NavItem to="/login">Login</NavItem>
          )}
        </nav>
      </div>
    </header>
  );
}

