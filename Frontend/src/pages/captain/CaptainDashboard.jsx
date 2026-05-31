import { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import {
  DollarSign,
  Clock,
  User,
  LogOut,
  Car,
  CheckCircle,
  Navigation2,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
// ── Leaflet ──────────────────────────────────────────────────────────────────
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

  const [ride, setRide] = useState(null); // incoming request
  const [activeRide, setActiveRide] = useState(null); // accepted ride
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [ridesCount, setRidesCount] = useState(0);
  const [myPos, setMyPos] = useState(null); // captain's GPS
  const [customerPos, setCustomerPos] = useState(null); // customer's GPS
  const [rideTimer, setRideTimer] = useState(0);

  const timerRef = useRef(null);

  // ── Socket setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!captainId) return navigate("/");

    socket.emit("join", { userId: captainId, role: "captain" });

    // Incoming ride request
    socket.on("new-ride", (data) => {
      setRide(data);
      toast.info("🚕 New ride request!");
    });

    // Receive customer location (sent after captain requests it)
    socket.on("customer-location", (loc) => {
      if (loc?.lat && loc?.lng) setCustomerPos([loc.lat, loc.lng]);
    });

    return () => {
      socket.off("new-ride");
      socket.off("customer-location");
    };
  }, [captainId]);

  // ── Timer for active ride ───────────────────────────────────────────────────
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

  // ── Go Online / Offline ─────────────────────────────────────────────────────
  const goOnline = () => {
    socket.emit("captain-online", captainId);
    setIsOnline(true);
    toast.success("You're online 🟢");
    startGPS();
  };
  const { theme } = useTheme();
  const goOffline = () => {
    setIsOnline(false);
    setRide(null);
    stopGPS();
    toast.info("You're offline 🔴");
  };

  // ── GPS Tracking ────────────────────────────────────────────────────────────
  const startGPS = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMyPos([loc.lat, loc.lng]);

        // Broadcast to current ride's user
        if (activeRideRef.current) {
          socket.emit("driver-location", {
            rideId: activeRideRef.current._id,
            userId: activeRideRef.current.user,
            location: loc,
          });
        }
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

  // Need a ref so the GPS callback always sees the latest activeRide
  const activeRideRef = useRef(null);
  useEffect(() => {
    activeRideRef.current = activeRide;
  }, [activeRide]);

  // ── Request customer location ───────────────────────────────────────────────
  const requestCustomerLocation = () => {
    if (!activeRide) return;
    socket.emit("request-customer-location", { userId: activeRide.user });
    toast.info("Requesting customer location...");
  };

  // ── Accept Ride ─────────────────────────────────────────────────────────────
  const acceptRide = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/ride/accept", {
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

        // Tell socket layer (and user) we accepted
        socket.emit("accept-ride", {
          rideId: data.ride._id,
          userId:
            typeof data.ride.user === "object"
              ? data.ride.user._id
              : data.ride.user,
          captainId,
        });

        // Immediately ask for customer location
        const userId =
          typeof data.ride.user === "object"
            ? data.ride.user._id
            : data.ride.user;
        socket.emit("request-customer-location", { userId });
      } else {
        toast.error(data.message || "Failed to accept");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const rejectRide = () => {
    setRide(null);
    toast.info("Ride rejected");
  };

  // ── Complete Ride ───────────────────────────────────────────────────────────
  const completeRide = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/ride/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rideId: activeRide._id }),
      });

      // Also emit socket so user's screen updates instantly
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

  // ── MAP CENTER ──────────────────────────────────────────────────────────────
  const mapCenter = customerPos || myPos || [19.076, 72.877];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <ThemeToggle />
      {/* ── HEADER ── */}
      <div className="px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C518] flex items-center justify-center">
              <Car size={20} className="text-black" />
            </div>
            <div>
              <p
                className="font-bold"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Captain Mode
              </p>
              <p className="text-[#555] text-xs">GetYourRide</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/captain/profile")}
              className="w-9 h-9 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center hover:border-[#333] transition"
            >
              <User size={16} className="text-[#888]" />
            </button>
            <button
              onClick={logout}
              className="w-9 h-9 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center hover:border-red-500/50 transition"
            >
              <LogOut size={16} className="text-[#888]" />
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
              className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-3 text-center"
            >
              <p
                className="text-lg font-bold text-[#F5C518]"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {s.value}
              </p>
              <p className="text-[#555] text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Online toggle */}
        <button
          onClick={isOnline ? goOffline : goOnline}
          disabled={!!activeRide}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 ${
            isOnline
              ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
              : "bg-[#F5C518] text-black hover:bg-yellow-400"
          }`}
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          <span
            className={`w-3 h-3 rounded-full ${isOnline ? "bg-red-400 animate-pulse" : "bg-black"}`}
          />
          {isOnline ? "Go Offline" : "Go Online & Start Earning"}
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 px-4 pb-8">
        {/* Idle */}
        {!isOnline && !activeRide && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-6xl mb-4">🚗</span>
            <p
              className="text-white font-semibold mb-1"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Ready to earn?
            </p>
            <p className="text-[#555] text-sm">
              Go online to start receiving ride requests
            </p>
          </div>
        )}

        {/* Waiting for ride */}
        {isOnline && !ride && !activeRide && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#F5C518]/30 border-t-[#F5C518] animate-spin mb-6" />
            <p
              className="text-white font-semibold mb-1"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Searching for rides...
            </p>
            <p className="text-[#555] text-sm">You'll be notified instantly</p>
            {myPos && (
              <p className="text-[#333] text-xs mt-3">
                📍 GPS active: {myPos[0].toFixed(4)}, {myPos[1].toFixed(4)}
              </p>
            )}
          </div>
        )}

        {/* ─── NEW RIDE REQUEST ─────────────────────────────────────────── */}
        {ride && (
          <div className="bg-[#111] border-2 border-[#F5C518]/40 rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5C518] animate-ping" />
              <p className="text-xs font-bold text-[#F5C518] uppercase tracking-widest">
                New Ride Request!
              </p>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex flex-col items-center pt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F5C518]" />
                <div className="w-px flex-1 bg-[#2a2a2a] my-1.5" />
                <div className="w-2.5 h-2.5 rounded-sm bg-white" />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs text-[#555]">Pickup</p>
                  <p className="text-white text-sm font-medium">
                    {ride.pickup}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#555]">Destination</p>
                  <p className="text-white text-sm font-medium">
                    {ride.destination}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
                <p
                  className="text-[#F5C518] font-bold text-lg"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  ₹{ride.fare}
                </p>
                <p className="text-[#555] text-xs">Fare</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
                <p
                  className="text-[#F5C518] font-bold text-lg"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {ride.distance} km
                </p>
                <p className="text-[#555] text-xs">Distance</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
                <p
                  className="text-[#F5C518] font-bold text-lg capitalize"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {ride.vehicleType}
                </p>
                <p className="text-[#555] text-xs">Vehicle</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={rejectRide}
                className="py-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 transition"
              >
                Reject
              </button>
              <button
                onClick={acceptRide}
                className="py-3.5 rounded-xl bg-[#F5C518] text-black font-bold hover:bg-yellow-400 active:scale-95 transition"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Accept 🚗
              </button>
            </div>
          </div>
        )}

        {/* ─── ACTIVE RIDE ──────────────────────────────────────────────── */}
        {activeRide && (
          <div>
            {/* Live map showing customer + captain positions */}
            <div
              className="rounded-2xl overflow-hidden border border-[#1e1e1e] mb-4"
              style={{ height: "260px" }}
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

                {/* Captain's own position */}
                {myPos && <Marker position={myPos} />}

                {/* Customer's position */}
                {customerPos && (
                  <>
                    <Marker position={customerPos} icon={customerIcon} />
                    <MapPan pos={customerPos} />
                  </>
                )}
              </MapContainer>
            </div>

            {/* Ride info card */}
            <div className="bg-[#111] border border-green-500/25 rounded-2xl p-5 mb-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs font-bold text-green-400 uppercase tracking-widest">
                    Ride Active
                  </p>
                </div>
                <span
                  className="text-[#F5C518] font-mono font-bold"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {fmtTime(rideTimer)}
                </span>
              </div>

              <div className="flex gap-3 mb-4">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F5C518]" />
                  <div className="w-px flex-1 bg-[#2a2a2a] my-1.5" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-white" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-xs text-[#555]">Pickup</p>
                    <p className="text-white text-sm">{activeRide.pickup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#555]">Destination</p>
                    <p className="text-white text-sm">
                      {activeRide.destination}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[#555]">Fare</p>
                  <p
                    className="text-[#F5C518] font-bold text-xl"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    ₹{activeRide.fare}
                  </p>
                </div>
              </div>

              {/* Request customer location button */}
              <button
                onClick={requestCustomerLocation}
                className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:border-[#F5C518] hover:text-[#F5C518] transition text-sm"
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
