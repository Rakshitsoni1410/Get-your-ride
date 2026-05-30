import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Car, Bike, Truck, Clock, Users, ChevronRight, MapPin, Loader } from "lucide-react";

const VEHICLE_META = {
  car:  { name: "Car",  Icon: Car,   time: "4-6 min", capacity: 4, desc: "Comfortable AC ride",   rates: { base: 50, perKm: 14 } },
  bike: { name: "Bike", Icon: Bike,  time: "2-4 min", capacity: 1, desc: "Quick & affordable",    rates: { base: 25, perKm:  7 } },
  auto: { name: "Auto", Icon: Truck, time: "3-5 min", capacity: 3, desc: "Budget friendly",        rates: { base: 35, perKm: 10 } },
};

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(2));
}

function calcFare(type, km) {
  const r = VEHICLE_META[type].rates;
  return Math.max(Math.round(r.base + km * r.perKm + km * 3 * (type === "car" ? 1.5 : type === "bike" ? 0.8 : 1.0)), r.base);
}

const getCoords = async (address) => {
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
  const d = await r.json();
  return d.length ? { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) } : null;
};

export default function RideSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("car");
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(true);
  const [distance, setDistance] = useState(null);
  const [coords, setCoords] = useState({ pickup: null, destination: null });

  // Resolve coordinates + calc real distance on mount
  useEffect(() => {
    const resolve = async () => {
      setResolving(true);
      try {
        const [pc, dc] = await Promise.all([
          getCoords(state.pickup),
          getCoords(state.destination),
        ]);
        if (pc && dc) {
          setCoords({ pickup: pc, destination: dc });
          setDistance(haversineKm(pc.lat, pc.lng, dc.lat, dc.lng));
        } else {
          toast.error("Couldn't resolve one of the addresses");
          setDistance(5); // fallback
        }
      } catch {
        setDistance(5);
      }
      setResolving(false);
    };
    resolve();
  }, []);

  const confirmRide = async () => {
    if (!distance) return toast.error("Still resolving distance...");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const fare = calcFare(selected, distance);

      const res = await fetch("http://localhost:5000/api/ride/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({
          pickup: state.pickup,
          destination: state.destination,
          pickupCoords: coords.pickup,
          destinationCoords: coords.destination,
          vehicleType: selected,
          distance,
          fare,
        }),
      });

      const data = await res.json();
      if (data.ride) {
        toast.success("Ride booked! Finding a driver... 🚕");
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

  const estTime = distance ? `~${Math.round(distance * 3)} min` : "—";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <div className="flex-1 px-4 pt-10 pb-28">
        <button onClick={() => navigate(-1)} className="text-[#666] hover:text-white transition text-sm mb-6">← Back</button>

        <p className="section-label">Step 2 of 2</p>
        <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Choose vehicle</h1>

        {/* Route + distance */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3 mb-6">
          <div className="flex items-center gap-3">
            <MapPin size={15} className="text-[#F5C518] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#555] truncate">{state?.pickup}</p>
              <p className="text-xs text-[#888] truncate mt-0.5">→ {state?.destination}</p>
            </div>
            <div className="text-right flex-shrink-0">
              {resolving ? (
                <Loader size={14} className="text-[#555] animate-spin" />
              ) : (
                <>
                  <p className="text-white text-sm font-bold">{distance} km</p>
                  <p className="text-[#555] text-xs">{estTime} drive</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle options */}
        <div className="space-y-3">
          {Object.entries(VEHICLE_META).map(([key, v]) => {
            const { Icon } = v;
            const active = selected === key;
            const fare = distance ? calcFare(key, distance) : null;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                  active ? "bg-[#F5C518] border-[#F5C518] text-black" : "bg-[#111] border-[#1e1e1e] hover:border-[#333]"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-black/15" : "bg-[#1a1a1a]"}`}>
                  <Icon size={22} className={active ? "text-black" : "text-[#F5C518]"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base" style={{ fontFamily: "Syne, sans-serif" }}>{v.name}</p>
                  <p className={`text-xs mt-0.5 ${active ? "text-black/60" : "text-[#555]"}`}>{v.desc}</p>
                  <div className={`flex items-center gap-3 mt-1 text-xs ${active ? "text-black/70" : "text-[#666]"}`}>
                    <span className="flex items-center gap-1"><Clock size={11} />{v.time}</span>
                    <span className="flex items-center gap-1"><Users size={11} />{v.capacity} seat{v.capacity > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {fare ? (
                    <>
                      <p className={`text-xl font-extrabold ${active ? "text-black" : "text-white"}`} style={{ fontFamily: "Syne, sans-serif" }}>
                        ₹{fare}
                      </p>
                      <p className={`text-xs ${active ? "text-black/60" : "text-[#555]"}`}>est. fare</p>
                    </>
                  ) : (
                    <Loader size={16} className="text-[#555] animate-spin" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Fare breakdown info */}
        {distance && (
          <div className="mt-4 bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
            <p className="text-xs text-[#555] uppercase tracking-widest font-semibold mb-3">Fare Breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#555]">Base fare</span><span>₹{VEHICLE_META[selected].rates.base}</span></div>
              <div className="flex justify-between"><span className="text-[#555]">Distance ({distance} km × ₹{VEHICLE_META[selected].rates.perKm})</span><span>₹{Math.round(distance * VEHICLE_META[selected].rates.perKm)}</span></div>
              <div className="flex justify-between"><span className="text-[#555]">Time charge (~{Math.round(distance*3)} min)</span><span>₹{Math.round(distance * 3 * (selected === "car" ? 1.5 : selected === "bike" ? 0.8 : 1.0))}</span></div>
              <div className="flex justify-between border-t border-[#222] pt-2 font-bold text-[#F5C518]">
                <span>Total</span><span>₹{calcFare(selected, distance)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur border-t border-[#1e1e1e] px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#555] text-xs">Total estimate</p>
            <p className="text-2xl font-extrabold text-[#F5C518]" style={{ fontFamily: "Syne, sans-serif" }}>
              {distance ? `₹${calcFare(selected, distance)}` : "..."}
            </p>
          </div>
          <button
            onClick={confirmRide}
            disabled={loading || resolving}
            className="flex items-center gap-2 bg-[#F5C518] text-black font-bold px-6 py-3.5 rounded-xl hover:bg-yellow-400 active:scale-95 transition-all disabled:opacity-50"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {loading ? "Booking..." : `Book ${VEHICLE_META[selected].name}`}
            {!loading && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
