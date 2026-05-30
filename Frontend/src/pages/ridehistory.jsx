import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { Car, Bike, Truck, Clock, MapPin, ChevronRight, Star } from "lucide-react";

const vehicleIcon = { car: Car, bike: Bike, auto: Truck };

const statusColor = {
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  requested: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  accepted:  "bg-blue-500/10  text-blue-400  border-blue-500/20",
  cancelled: "bg-red-500/10   text-red-400   border-red-500/20",
};

export default function RideHistory() {
  const navigate = useNavigate();
  const [rides,   setRides]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/ride/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setRides(d.rides || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? rides : rides.filter((r) => r.status === filter);

  const totalSpent   = rides.filter((r) => r.status === "completed").reduce((s, r) => s + (r.fare || 0), 0);
  const totalRides   = rides.filter((r) => r.status === "completed").length;
  const totalKm      = rides.filter((r) => r.status === "completed").reduce((s, r) => s + (r.distance || 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <div className="flex-1 px-4 pt-10 pb-4">

        {/* Header */}
        <button onClick={() => navigate(-1)} className="text-[#666] hover:text-white transition text-sm mb-4">← Back</button>
        <p className="section-label">Your trips</p>
        <h1 className="text-3xl font-extrabold mb-6" style={{ fontFamily: "Syne, sans-serif" }}>Ride History</h1>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Rides", value: totalRides },
            { label: "KM Travelled", value: `${totalKm.toFixed(1)}` },
            { label: "Total Spent",  value: `₹${totalSpent}` },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-3 text-center">
              <p className="text-lg font-bold text-[#F5C518]" style={{ fontFamily: "Syne, sans-serif" }}>{s.value}</p>
              <p className="text-[#555] text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {["all", "completed", "accepted", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition border ${
                filter === f
                  ? "bg-[#F5C518] text-black border-[#F5C518]"
                  : "bg-[#111] text-[#555] border-[#1e1e1e] hover:border-[#333]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Ride list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🚗</span>
            <p className="text-white font-semibold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>No rides found</p>
            <p className="text-[#555] text-sm">Book your first ride!</p>
            <button onClick={() => navigate("/home")} className="mt-4 px-6 py-2.5 bg-[#F5C518] text-black font-bold rounded-xl text-sm">
              Book a Ride
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ride) => {
              const Icon = vehicleIcon[ride.vehicleType] || Car;
              const date = new Date(ride.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              });
              const time = new Date(ride.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit", minute: "2-digit",
              });
              return (
                <div
                  key={ride._id}
                  className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 hover:border-[#2a2a2a] transition"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                        <Icon size={18} className="text-[#F5C518]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold capitalize">{ride.vehicleType || "Car"}</p>
                        <p className="text-[#555] text-xs">{date} · {time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#F5C518] font-bold" style={{ fontFamily: "Syne, sans-serif" }}>₹{ride.fare}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor[ride.status] || statusColor.requested}`}>
                        {ride.status}
                      </span>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center pt-1 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#F5C518]" />
                      <div className="w-px flex-1 bg-[#2a2a2a] my-1" />
                      <div className="w-2 h-2 rounded-sm bg-white" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-xs text-[#888] truncate">{ride.pickup}</p>
                      <p className="text-xs text-[#888] truncate">{ride.destination}</p>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1a1a1a]">
                    <div className="flex items-center gap-3 text-xs text-[#555]">
                      <span>{ride.distance} km</span>
                      {ride.captain?.fullname && (
                        <span>· {ride.captain.fullname.firstname}</span>
                      )}
                    </div>
                    {ride.status === "completed" && !ride.rating && (
                      <button
                        onClick={() => navigate("/ride/rate", { state: ride })}
                        className="flex items-center gap-1 text-xs text-[#F5C518] font-semibold hover:underline"
                      >
                        <Star size={12} fill="#F5C518" /> Rate ride
                      </button>
                    )}
                    {ride.rating && (
                      <span className="flex items-center gap-1 text-xs text-[#F5C518]">
                        <Star size={12} fill="#F5C518" /> {ride.rating}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <UserNavbar />
    </div>
  );
}