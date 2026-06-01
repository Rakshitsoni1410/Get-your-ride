import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Car,
  Hash,
  Calendar,
  LogOut,
  Star,
  BadgeCheck,
} from "lucide-react";

export default function CaptainProfile() {
  const [captain, setCaptain] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://get-your-ride.onrender.com/api/captain/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.captain) setCaptain(d.captain);
        else {
          toast.error("Unauthorized");
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Error loading profile");
        navigate("/");
      });
  }, []);

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate("/");
  };

  if (!captain)
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 py-3.5 border-b border-[#1a1a1a] last:border-0">
      <div className="w-9 h-9 bg-[#1a1a1a] rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-[#F5C518]" />
      </div>
      <div>
        <p className="text-[#555] text-xs">{label}</p>
        <p className="text-white text-sm font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[#666] hover:text-white transition text-sm mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center text-4xl mb-3">
          👨‍✈️
        </div>
        <div className="flex items-center gap-2">
          <h1
            className="text-2xl font-extrabold"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {captain.fullname?.firstname} {captain.fullname?.lastname}
          </h1>
          {captain.isVerified && (
            <BadgeCheck size={20} className="text-blue-400" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#F5C518] text-sm flex items-center gap-1">
            <Star size={13} fill="#F5C518" /> {captain.rating || 5.0}
          </span>
          <span className="text-[#555] text-sm">
            · {captain.totalRides || 0} rides
          </span>
        </div>
        <span
          className={`mt-2 pill ${captain.status === "online" ? "bg-green-500/15 text-green-400" : "bg-[#1a1a1a] text-[#555]"}`}
        >
          {captain.status || "offline"}
        </span>
      </div>

      {/* Personal info */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl px-4 mb-4">
        <p className="section-label pt-4">Personal</p>
        <InfoRow icon={Mail} label="Email" value={captain.email} />
        <InfoRow icon={Phone} label="Phone" value={captain.phone} />
      </div>

      {/* Vehicle info */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl px-4 mb-6">
        <p className="section-label pt-4">Vehicle</p>
        <InfoRow icon={Car} label="Type" value={captain.vehicle?.vehicleType} />
        <InfoRow icon={Hash} label="Plate" value={captain.vehicle?.plate} />
        <InfoRow
          icon={User}
          label="Capacity"
          value={`${captain.vehicle?.capacity} seats`}
        />
        {captain.license?.expiry && (
          <InfoRow
            icon={Calendar}
            label="License Expiry"
            value={new Date(captain.license.expiry).toLocaleDateString()}
          />
        )}
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold py-3.5 rounded-xl hover:bg-red-500/20 active:scale-95 transition"
      >
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );
}
