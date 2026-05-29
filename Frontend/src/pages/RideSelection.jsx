import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Car, Bike, Truck, Clock, MapPin, ChevronRight, Users } from "lucide-react";

const RIDE_TYPES = {
  car: { name: "Car", base: 50, perKm: 12, icon: Car, time: "4-6 min", capacity: 4, desc: "Comfortable AC ride" },
  bike: { name: "Bike", base: 20, perKm: 6, icon: Bike, time: "2-4 min", capacity: 1, desc: "Quick & affordable" },
  auto: { name: "Auto", base: 30, perKm: 8, icon: Truck, time: "3-5 min", capacity: 3, desc: "Budget friendly" },
};

export default function RideSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("car");
  const [loading, setLoading] = useState(false);
  const [distance] = useState(4.5);

  const getPrice = (type) => Math.round(RIDE_TYPES[type].base + distance * RIDE_TYPES[type].perKm);

  const getCoords = async (address) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  };

  const confirmRide = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const pickupCoords = await getCoords(state.pickup);
      const destinationCoords = await getCoords(state.destination);

      if (!pickupCoords || !destinationCoords) {
        return toast.error("Couldn't resolve location. Try a more specific address.");
      }

      const res = await fetch("http://localhost:5000/api/ride/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({
          pickup: state.pickup,
          destination: state.destination,
          pickupCoords,
          destinationCoords,
          vehicleType: selected,
          distance,
          fare: getPrice(selected),
        }),
      });

      const data = await res.json();
      if (data.ride) {
        toast.success("Ride booked! Finding your driver... 🚕");
        navigate("/ride/searching", { state: data.ride });
      } else {
        toast.error(data.message || "Failed to book ride");
      }
    } catch {
      toast.error("Server error. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <div className="flex-1 px-4 pt-10 pb-24">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="text-[#666] hover:text-white transition text-sm mb-6 flex items-center gap-1">
          ← Back
        </button>

        <p className="section-label">Step 2 of 2</p>
        <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Choose vehicle</h1>

        {/* Route summary */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <MapPin size={16} className="text-[#F5C518] flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-[#555] truncate">{state?.pickup}</p>
            <p className="text-xs text-[#888] truncate">→ {state?.destination}</p>
          </div>
          <span className="ml-auto text-xs text-[#555] whitespace-nowrap">{distance} km</span>
        </div>

        {/* Ride options */}
        <div className="space-y-3">
          {Object.entries(RIDE_TYPES).map(([key, ride]) => {
            const Icon = ride.icon;
            const isActive = selected === key;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                  isActive
                    ? "bg-[#F5C518] border-[#F5C518] text-black scale-[1.01]"
                    : "bg-[#111] border-[#1e1e1e] hover:border-[#333]"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? "bg-black/15" : "bg-[#1a1a1a]"}`}>
                  <Icon size={22} className={isActive ? "text-black" : "text-[#F5C518]"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-base ${isActive ? "" : "text-white"}`} style={{ fontFamily: 'Syne, sans-serif' }}>{ride.name}</p>
                  <p className={`text-xs mt-0.5 ${isActive ? "text-black/60" : "text-[#555]"}`}>{ride.desc}</p>
                  <div className={`flex items-center gap-3 mt-1 text-xs ${isActive ? "text-black/70" : "text-[#666]"}`}>
                    <span className="flex items-center gap-1"><Clock size={11} /> {ride.time}</span>
                    <span className="flex items-center gap-1"><Users size={11} /> {ride.capacity} seat{ride.capacity > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xl font-extrabold ${isActive ? "text-black" : "text-white"}`} style={{ fontFamily: 'Syne, sans-serif' }}>
                    ₹{getPrice(key)}
                  </p>
                  <p className={`text-xs ${isActive ? "text-black/60" : "text-[#555]"}`}>est. fare</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1e1e1e] px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[#555] text-xs">Total fare estimate</p>
            <p className="text-2xl font-extrabold text-[#F5C518]" style={{ fontFamily: 'Syne, sans-serif' }}>₹{getPrice(selected)}</p>
          </div>
          <button
            onClick={confirmRide}
            disabled={loading}
            className="flex items-center gap-2 bg-[#F5C518] text-black font-bold px-6 py-3.5 rounded-xl hover:bg-yellow-400 active:scale-95 transition-all disabled:opacity-60"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {loading ? "Booking..." : `Book ${RIDE_TYPES[selected].name}`}
            {!loading && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
