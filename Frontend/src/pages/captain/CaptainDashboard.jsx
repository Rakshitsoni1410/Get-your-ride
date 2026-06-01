import { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import {
  DollarSign,
  User,
  LogOut,
  Car,
  CheckCircle,
  Navigation2,
} from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1076/1076928.png",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapPan({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.panTo(pos, { animate: true, duration: 1 });
  }, [pos]);
  return null;
}

let watchId = null;

export default function CaptainDashboard() {
  const navigate = useNavigate();
  const captainId = localStorage.getItem("captainId");
  const [ride, setRide] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [ridesCount, setRidesCount] = useState(0);
  const [myPos, setMyPos] = useState(null);
  const [customerPos, setCustomerPos] = useState(null);
  const [rideTimer, setRideTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!captainId) return navigate("/");
    socket.emit("join", { userId: captainId, role: "captain" });
    socket.on("new-ride", (data) => {
      setRide(data);
      toast.info("🚕 New ride request!");
    });
    socket.on("customer-location", (loc) => {
      if (loc?.lat && loc?.lng) setCustomerPos([loc.lat, loc.lng]);
    });
    return () => {
      socket.off("new-ride");
      socket.off("customer-location");
    };
  }, [captainId]);

  useEffect(() => {
    if (activeRide) {
      timerRef.current = setInterval(() => setRideTimer((p) => p + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setRideTimer(0);
    }
    return () => clearInterval(timerRef.current);
  }, [activeRide]);

  const fmtTime = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const activeRideRef = useRef(null);
  useEffect(() => {
    activeRideRef.current = activeRide;
  }, [activeRide]);

  const startGPS = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMyPos([loc.lat, loc.lng]);
        if (activeRideRef.current)
          socket.emit("driver-location", {
            rideId: activeRideRef.current._id,
            userId: activeRideRef.current.user,
            location: loc,
          });
      },
      () => toast.error("Location error"),
      { enableHighAccuracy: true, maximumAge: 2000 },
    );
  };
  const stopGPS = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  };

  const goOnline = () => {
    socket.emit("captain-online", captainId);
    setIsOnline(true);
    toast.success("You're online 🟢");
    startGPS();
  };
  const goOffline = () => {
    setIsOnline(false);
    setRide(null);
    stopGPS();
    toast.info("You're offline 🔴");
  };

  const requestCustomerLocation = () => {
    if (!activeRide) return;
    socket.emit("request-customer-location", { userId: activeRide.user });
    toast.info("Requesting customer location...");
  };

  const acceptRide = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://get-your-ride.onrender.com/api/ride/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId: ride._id }),
      });
      const data = await res.json();
      if (res.ok && data.ride) {
        setActiveRide(data.ride);
        setRide(null);
        setCustomerPos(null);
        toast.success("Ride accepted! Head to pickup. 🚗");
        socket.emit("accept-ride", {
          rideId: data.ride._id,
          userId:
            typeof data.ride.user === "object"
              ? data.ride.user._id
              : data.ride.user,
          captainId,
        });
        socket.emit("request-customer-location", {
          userId:
            typeof data.ride.user === "object"
              ? data.ride.user._id
              : data.ride.user,
        });
      } else toast.error(data.message || "Failed to accept");
    } catch {
      toast.error("Server error");
    }
  };

  const rejectRide = () => {
    setRide(null);
    toast.info("Ride rejected");
  };

  const completeRide = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("https://get-your-ride.onrender.com/api/ride/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId: activeRide._id }),
      });
      socket.emit("ride-completed-socket", {
        rideId: activeRide._id,
        userId:
          typeof activeRide.user === "object"
            ? activeRide.user._id
            : activeRide.user,
      });
      setEarnings((p) => p + (activeRide.fare || 0));
      setRidesCount((p) => p + 1);
      setActiveRide(null);
      setCustomerPos(null);
      toast.success(
        "Ride completed! ₹" + (activeRide.fare || 0) + " earned ✅",
      );
    } catch {
      toast.error("Error completing ride");
    }
  };

  const logout = () => {
    stopGPS();
    localStorage.clear();
    navigate("/");
  };
  const mapCenter = customerPos || myPos || [19.076, 72.877];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      {/* HEADER */}
      <div className="px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <Car size={20} style={{ color: "var(--accent-text)" }} />
            </div>
            <div>
              <p
                className="font-bold"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Captain Mode
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                GetYourRide
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <button
              onClick={() => navigate("/captain/profile")}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <User size={16} style={{ color: "var(--text-secondary)" }} />
            </button>
            <button
              onClick={logout}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <LogOut size={16} style={{ color: "var(--text-secondary)" }} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Earnings", value: `₹${earnings}` },
            { label: "Rides", value: ridesCount },
            { label: "Status", value: isOnline ? "Online" : "Offline" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-3 text-center"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <p
                className="text-lg font-bold"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "var(--accent)",
                }}
              >
                {s.value}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Online toggle */}
        <button
          onClick={isOnline ? goOffline : goOnline}
          disabled={!!activeRide}
          className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          style={
            isOnline
              ? {
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                  fontFamily: "Syne, sans-serif",
                }
              : {
                  background: "var(--accent)",
                  color: "var(--accent-text)",
                  fontFamily: "Syne, sans-serif",
                }
          }
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: isOnline ? "#f87171" : "var(--accent-text)" }}
          />
          {isOnline ? "Go Offline" : "Go Online & Start Earning"}
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-4 pb-8">
        {!isOnline && !activeRide && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-6xl mb-4">🚗</span>
            <p
              className="font-semibold mb-1"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Ready to earn?
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Go online to start receiving ride requests
            </p>
          </div>
        )}

        {isOnline && !ride && !activeRide && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin mb-6"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--accent) 30%, transparent)",
                borderTopColor: "var(--accent)",
              }}
            />
            <p
              className="font-semibold mb-1"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Searching for rides...
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              You'll be notified instantly
            </p>
            {myPos && (
              <p
                className="text-xs mt-3"
                style={{ color: "var(--text-muted)" }}
              >
                📍 GPS: {myPos[0].toFixed(4)}, {myPos[1].toFixed(4)}
              </p>
            )}
          </div>
        )}

        {/* NEW RIDE REQUEST */}
        {ride && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background: "var(--bg-card)",
              border: `2px solid color-mix(in srgb, var(--accent) 40%, transparent)`,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ background: "var(--accent)" }}
              />
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                New Ride Request!
              </p>
            </div>
            <div className="flex gap-3 mb-4">
              <div className="flex flex-col items-center pt-1">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                <div
                  className="w-px flex-1 my-1.5"
                  style={{ background: "var(--border-input)" }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: "var(--text-primary)" }}
                />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Pickup
                  </p>
                  <p className="text-sm font-medium">{ride.pickup}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Destination
                  </p>
                  <p className="text-sm font-medium">{ride.destination}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                [`₹${ride.fare}`, "Fare"],
                [`${ride.distance} km`, "Distance"],
                [ride.vehicleType, "Vehicle"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-xl p-3 text-center"
                  style={{ background: "var(--bg-input)" }}
                >
                  <p
                    className="font-bold text-lg capitalize"
                    style={{
                      fontFamily: "Syne, sans-serif",
                      color: "var(--accent)",
                    }}
                  >
                    {v}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {l}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={rejectRide}
                className="py-3.5 rounded-xl font-semibold transition"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                }}
              >
                Reject
              </button>
              <button
                onClick={acceptRide}
                className="py-3.5 rounded-xl font-bold transition active:scale-95"
                style={{
                  fontFamily: "Syne, sans-serif",
                  background: "var(--accent)",
                  color: "var(--accent-text)",
                }}
              >
                Accept 🚗
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE RIDE */}
        {activeRide && (
          <div>
            <div
              className="rounded-2xl overflow-hidden mb-4"
              style={{
                height: "260px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <MapContainer
                center={mapCenter}
                zoom={14}
                className="h-full w-full"
                zoomControl={false}
                key={activeRide._id}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution=""
                />
                {myPos && <Marker position={myPos} />}
                {customerPos && (
                  <>
                    <Marker position={customerPos} icon={customerIcon} />
                    <MapPan pos={customerPos} />
                  </>
                )}
              </MapContainer>
            </div>

            <div
              className="rounded-2xl p-5 mb-3"
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-widest text-green-400">
                    Ride Active
                  </p>
                </div>
                <span
                  className="font-mono font-bold"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    color: "var(--accent)",
                  }}
                >
                  {fmtTime(rideTimer)}
                </span>
              </div>
              <div className="flex gap-3 mb-4">
                <div className="flex flex-col items-center pt-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                  <div
                    className="w-px flex-1 my-1.5"
                    style={{ background: "var(--border-input)" }}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: "var(--text-primary)" }}
                  />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Pickup
                    </p>
                    <p className="text-sm">{activeRide.pickup}</p>
                  </div>
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Destination
                    </p>
                    <p className="text-sm">{activeRide.destination}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Fare
                  </p>
                  <p
                    className="font-bold text-xl"
                    style={{
                      fontFamily: "Syne, sans-serif",
                      color: "var(--accent)",
                    }}
                  >
                    ₹{activeRide.fare}
                  </p>
                </div>
              </div>
              <button
                onClick={requestCustomerLocation}
                className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition"
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-input)",
                  color: "var(--text-secondary)",
                }}
              >
                <Navigation2 size={16} />{" "}
                {customerPos
                  ? "Refresh Customer Location"
                  : "Show Customer on Map"}
              </button>
              <button
                onClick={completeRide}
                className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                <CheckCircle size={20} /> Complete Ride
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
