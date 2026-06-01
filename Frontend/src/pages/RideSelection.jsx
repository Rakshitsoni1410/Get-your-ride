import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Car,
  Bike,
  Truck,
  Clock,
  Users,
  ChevronRight,
  MapPin,
  Loader,
} from "lucide-react";

const VEHICLE_META = {
  car: {
    name: "Car",
    Icon: Car,
    time: "4-6 min",
    capacity: 4,
    desc: "Comfortable AC ride",
    rates: { base: 50, perKm: 14 },
  },
  bike: {
    name: "Bike",
    Icon: Bike,
    time: "2-4 min",
    capacity: 1,
    desc: "Quick & affordable",
    rates: { base: 25, perKm: 7 },
  },
  auto: {
    name: "Auto",
    Icon: Truck,
    time: "3-5 min",
    capacity: 3,
    desc: "Budget friendly",
    rates: { base: 35, perKm: 10 },
  },
};

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371,
    toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1),
    dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return parseFloat(
    (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2),
  );
}

function calcFare(type, km) {
  const r = VEHICLE_META[type].rates;
  return Math.max(
    Math.round(
      r.base +
        km * r.perKm +
        km * 3 * (type === "car" ? 1.5 : type === "bike" ? 0.8 : 1.0),
    ),
    r.base,
  );
}

const getCoords = async (address) => {
  const r = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
  );
  const d = await r.json();
  return d.length
    ? { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) }
    : null;
};

export default function RideSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("car");
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(true);
  const [distance, setDistance] = useState(null);
  const [coords, setCoords] = useState({ pickup: null, destination: null });

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
          setDistance(5);
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
      const res = await fetch("https://get-your-ride.onrender.com/api/ride/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
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
      } else toast.error(data.message || "Failed to book ride");
    } catch {
      toast.error("Server error. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const estTime = distance ? `~${Math.round(distance * 3)} min` : "—";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      <div className="flex-1 px-4 pt-10 pb-28">
        <button
          onClick={() => navigate(-1)}
          className="transition text-sm mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          ← Back
        </button>

        <p className="section-label">Step 2 of 2</p>
        <h1
          className="text-3xl font-extrabold mb-2"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Choose vehicle
        </h1>

        {/* Route + distance */}
        <div
          className="rounded-xl px-4 py-3 mb-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex items-center gap-3">
            <MapPin
              size={15}
              className="flex-shrink-0"
              style={{ color: "var(--accent)" }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-xs truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {state?.pickup}
              </p>
              <p
                className="text-xs truncate mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                → {state?.destination}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              {resolving ? (
                <Loader
                  size={14}
                  className="animate-spin"
                  style={{ color: "var(--text-muted)" }}
                />
              ) : (
                <>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {distance} km
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {estTime} drive
                  </p>
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
                className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left"
                style={
                  active
                    ? {
                        background: "var(--accent)",
                        borderColor: "var(--accent)",
                        color: "var(--accent-text)",
                      }
                    : {
                        background: "var(--bg-card)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-primary)",
                      }
                }
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: active ? "rgba(0,0,0,0.15)" : "var(--bg-input)",
                  }}
                >
                  <Icon
                    size={22}
                    style={{
                      color: active ? "var(--accent-text)" : "var(--accent)",
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-base"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {v.name}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color: active ? "rgba(0,0,0,0.55)" : "var(--text-muted)",
                    }}
                  >
                    {v.desc}
                  </p>
                  <div
                    className="flex items-center gap-3 mt-1 text-xs"
                    style={{
                      color: active
                        ? "rgba(0,0,0,0.6)"
                        : "var(--text-secondary)",
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {v.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {v.capacity} seat{v.capacity > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {fare ? (
                    <>
                      <p
                        className="text-xl font-extrabold"
                        style={{ fontFamily: "Syne, sans-serif" }}
                      >
                        ₹{fare}
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: active
                            ? "rgba(0,0,0,0.55)"
                            : "var(--text-muted)",
                        }}
                      >
                        est. fare
                      </p>
                    </>
                  ) : (
                    <Loader
                      size={16}
                      className="animate-spin"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Fare breakdown */}
        {distance && (
          <div
            className="mt-4 rounded-xl p-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Fare Breakdown
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>Base fare</span>
                <span>₹{VEHICLE_META[selected].rates.base}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>
                  Distance ({distance} km × ₹
                  {VEHICLE_META[selected].rates.perKm})
                </span>
                <span>
                  ₹{Math.round(distance * VEHICLE_META[selected].rates.perKm)}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>
                  Time charge (~{Math.round(distance * 3)} min)
                </span>
                <span>
                  ₹
                  {Math.round(
                    distance *
                      3 *
                      (selected === "car"
                        ? 1.5
                        : selected === "bike"
                          ? 0.8
                          : 1.0),
                  )}
                </span>
              </div>
              <div
                className="flex justify-between pt-2 font-bold"
                style={{
                  borderTop: "1px solid var(--border-subtle)",
                  color: "var(--accent)",
                }}
              >
                <span>Total</span>
                <span>₹{calcFare(selected, distance)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 backdrop-blur px-4 py-4"
        style={{
          background: "var(--overlay-bg)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Total estimate
            </p>
            <p
              className="text-2xl font-extrabold"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--accent)" }}
            >
              {distance ? `₹${calcFare(selected, distance)}` : "..."}
            </p>
          </div>
          <button
            onClick={confirmRide}
            disabled={loading || resolving}
            className="flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            style={{
              fontFamily: "Syne, sans-serif",
              background: "var(--accent)",
              color: "var(--accent-text)",
            }}
          >
            {loading ? "Booking..." : `Book ${VEHICLE_META[selected].name}`}
            {!loading && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
