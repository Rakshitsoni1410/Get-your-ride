import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { toast } from "react-toastify";
import { LogOut, User, Mail, Star, Car } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d.user) setUser(d.user); else navigate("/"); })
      .catch(() => navigate("/"));
  }, []);

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out!");
    navigate("/");
  };

  if (!user) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <div className="flex-1 px-4 pt-10 pb-4">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-[#F5C518] flex items-center justify-center text-4xl mb-3">
            👤
          </div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif' }}>
            {user.fullname?.firstname} {user.fullname?.lastname}
          </h1>
          <div className="flex items-center gap-1 mt-1 text-[#F5C518] text-sm">
            <Star size={14} fill="#F5C518" /> <span>Rider</span>
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-3 mb-6">
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
              <User size={18} className="text-[#F5C518]" />
            </div>
            <div>
              <p className="text-[#555] text-xs">Full name</p>
              <p className="text-white font-medium text-sm">{user.fullname?.firstname} {user.fullname?.lastname}</p>
            </div>
          </div>

          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
              <Mail size={18} className="text-[#F5C518]" />
            </div>
            <div>
              <p className="text-[#555] text-xs">Email</p>
              <p className="text-white font-medium text-sm">{user.email}</p>
            </div>
          </div>

          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
              <Car size={18} className="text-[#F5C518]" />
            </div>
            <div>
              <p className="text-[#555] text-xs">Total rides</p>
              <p className="text-white font-medium text-sm">{user.totalRides || 0} rides</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold py-3.5 rounded-xl hover:bg-red-500/20 active:scale-95 transition"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
      <UserNavbar />
    </div>
  );
}
