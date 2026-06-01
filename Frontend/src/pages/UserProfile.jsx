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
    fetch("https://get-your-ride.onrender.com//api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
        else navigate("/");
      })
      .catch(() => navigate("/"));
  }, []);

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out!");
    navigate("/");
  };

  if (!user)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-base)" }}
      >
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{
            borderColor: "var(--accent)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="flex-1 px-4 pt-10 pb-4">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-3"
            style={{ background: "var(--accent)" }}
          >
            👤
          </div>
          <h1
            className="text-2xl font-extrabold"
            style={{
              fontFamily: "Syne, sans-serif",
              color: "var(--text-primary)",
            }}
          >
            {user.fullname?.firstname} {user.fullname?.lastname}
          </h1>
          <div
            className="flex items-center gap-1 mt-1 text-sm"
            style={{ color: "var(--accent)" }}
          >
            <Star size={14} fill="var(--accent)" /> <span>Rider</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {[
            {
              icon: User,
              label: "Full name",
              value: `${user.fullname?.firstname} ${user.fullname?.lastname}`,
            },
            { icon: Mail, label: "Email", value: user.email },
            {
              icon: Car,
              label: "Total rides",
              value: `${user.totalRides || 0} rides`,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--bg-input)" }}
              >
                <Icon size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {label}
                </p>
                <p
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition active:scale-95"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
          }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
      <UserNavbar />
    </div>
  );
}
