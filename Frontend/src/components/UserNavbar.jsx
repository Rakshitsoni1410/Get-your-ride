import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, toggle } = useTheme();

  const tabs = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/user/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="navbar safe-area-bottom">
      {tabs.map(({ path, label, icon: Icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 transition-all duration-200"
            style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition"
              style={{ background: active ? "rgba(245,197,24,0.12)" : "transparent" }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="flex flex-col items-center gap-1 transition-all duration-200"
        style={{ color: "var(--text-muted)" }}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition hover:bg-black/5 dark:hover:bg-white/5">
          {dark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
        </div>
        <span className="text-xs font-medium">{dark ? "Light" : "Dark"}</span>
      </button>
    </div>
  );
}
