import { useNavigate, useLocation } from "react-router-dom";
import { Home, User } from "lucide-react";

export default function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/user/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="bg-[#0A0A0A] border-t border-[#111] flex justify-around py-3 px-6 safe-area-bottom">
      {tabs.map(({ path, label, icon: Icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${active ? "text-[#F5C518]" : "text-[#555] hover:text-[#888]"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${active ? "bg-[#F5C518]/10" : ""}`}>
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
