import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import UserNavbar from "../components/UserNavbar";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { MapPin, Navigation, Search, ArrowRight } from "lucide-react";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    socket.emit("join", { userId, role: "user" });
    socket.on("ride-accepted", () => toast.success("Driver accepted your ride! 🚕"));
    return () => socket.off("ride-accepted");
  }, []);

  const fetchSuggestions = async (query, setter) => {
    if (query.length < 3) { setter([]); return; }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
      const data = await res.json();
      setter(data.map(d => ({ name: d.display_name.split(",").slice(0, 3).join(", "), full: d.display_name })));
    } catch { setter([]); }
  };

  const handleNext = () => {
    if (!pickup || !destination) return toast.error("Enter pickup & destination");
    navigate("/ride/confirm", { state: { pickup, destination } });
  };

  const useMyLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          const loc = data.display_name.split(",").slice(0, 3).join(", ");
          setPickup(loc);
          toast.success("Location set! 📍");
        } catch { toast.error("Couldn't get your location"); }
      },
      () => toast.error("Location access denied")
    );
  };

  const dropdownStyle = {
    background: "var(--bg-card)",
    border: "1px solid var(--border-input)",
    borderRadius: "0.75rem",
    boxShadow: "0 8px 32px var(--shadow)",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>
      <div className="flex-1 flex flex-col px-4 pt-10 pb-4">

        <div className="mb-8">
          <p className="section-label">GetYourRide</p>
          <h1 className="text-4xl font-extrabold leading-tight" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
            Where are you<br />going today?
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>Fast pickups · Real-time tracking · Safe rides</p>
        </div>

        {/* Booking card */}
        <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "0 10px 40px var(--shadow)" }}>

          {/* Pickup */}
          <div className="relative">
            <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all" style={{ background: "var(--bg-input)", border: "1px solid var(--border-input)" }}
              onFocus={() => {}} >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
              <input
                value={pickup}
                onChange={(e) => { setPickup(e.target.value); fetchSuggestions(e.target.value, setPickupSuggestions); }}
                onFocus={() => setActiveField("pickup")}
                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                placeholder="Pickup location"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "var(--text-primary)" }}
              />
              <button onClick={useMyLocation} className="transition" style={{ color: "var(--accent)" }} title="Use my location">
                <Navigation size={16} />
              </button>
            </div>

            {activeField === "pickup" && pickupSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden" style={dropdownStyle}>
                {pickupSuggestions.map((s, i) => (
                  <button key={i} onMouseDown={() => { setPickup(s.name); setPickupSuggestions([]); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm transition"
                    style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-hover)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <MapPin size={14} className="flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Connector */}
          <div className="flex items-center gap-3 px-4 py-1">
            <div className="w-3 flex justify-center">
              <div className="w-0.5 h-5" style={{ background: "var(--border-input)" }} />
            </div>
          </div>

          {/* Destination */}
          <div className="relative">
            <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all" style={{ background: "var(--bg-input)", border: "1px solid var(--border-input)" }}>
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: "var(--text-primary)" }} />
              <input
                value={destination}
                onChange={(e) => { setDestination(e.target.value); fetchSuggestions(e.target.value, setDestSuggestions); }}
                onFocus={() => setActiveField("dest")}
                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                placeholder="Where to?"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "var(--text-primary)" }}
              />
              <Search size={16} style={{ color: "var(--text-muted)" }} />
            </div>

            {activeField === "dest" && destSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden" style={dropdownStyle}>
                {destSuggestions.map((s, i) => (
                  <button key={i} onMouseDown={() => { setDestination(s.name); setDestSuggestions([]); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm transition"
                    style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-hover)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <MapPin size={14} className="flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleNext} className="btn flex items-center justify-center gap-2 !mt-4">
            Find Ride <ArrowRight size={18} />
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: "Avg Wait", value: "3 min" },
            { label: "Rides Done", value: "50K+" },
            { label: "Rating", value: "4.9 ★" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
              <p className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif", color: "var(--accent)" }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <UserNavbar />
    </div>
  );
}
