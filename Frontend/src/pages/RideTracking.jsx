import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import socket from "../socket";
import { toast } from "react-toastify";
import { Phone, Star, Navigation2, CheckCircle } from "lucide-react";

// ── Leaflet icon fix ──────────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const pickupIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "hue-rotate-60", // greenish tint
});

// Smoothly pan map to new position
function MapPan({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.panTo(position, { animate: true, duration: 1 });
  }, [position]);
  return null;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371,
    toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1),
    dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function RideTracking() {
  const { state } = useLocation(); // full ride object from SearchingDriver
  const navigate = useNavigate();
  const ride = state || {};

  const [driverPos, setDriverPos] = useState(null);
  const [statusMsg, setStatusMsg] = useState("Driver is on the way...");
  const [statusColor, setStatusColor] = useState("text-[#F5C518]");
  const [etaMin, setEtaMin] = useState(null);
  const [completed, setCompleted] = useState(false);

  // Coordinates
  const pickupCoords = ride.pickupCoords || null;
  const destCoords = ride.destinationCoords || null;

  // Build straight-line route polyline (will be replaced by driver trail)
  const routeLine =
    pickupCoords && destCoords
      ? Array.from({ length: 30 }, (_, i) => [
          pickupCoords.lat + ((destCoords.lat - pickupCoords.lat) * i) / 29,
          pickupCoords.lng + ((destCoords.lng - pickupCoords.lng) * i) / 29,
        ])
      : [];

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return navigate("/");

    // Ensure user is in their socket room (in case they navigated directly here)
    socket.emit("join", { userId, role: "user" });

    // ── Receive driver GPS ──────────────────────────────────────────────
    const onDriverLoc = (loc) => {
      if (!loc?.lat || !loc?.lng) return;
      const pos = [loc.lat, loc.lng];
      setDriverPos(pos);

      // Calculate ETA dynamically
      if (pickupCoords) {
        const distToPickup = haversineKm(
          loc.lat,
          loc.lng,
          pickupCoords.lat,
          pickupCoords.lng,
        );
        const eta = Math.max(1, Math.round(distToPickup * 3));
        setEtaMin(eta);
      }
    };

    // ── Receive customer GPS and send it back to captain ───────────────
    const onShareLocation = () => {
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          socket.emit("customer-location", {
            captainId: ride.captain?._id || ride.captain,
            location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
        },
        () => {},
      );
    };

    // ── Ride status events ──────────────────────────────────────────────
    const onRideStarted = () => {
      setStatusMsg("Ride in progress 🚗");
      setStatusColor("text-green-400");
      toast.info("Your ride has started!");
    };

    const onRideCompleted = () => {
      setCompleted(true);
      toast.success("You've arrived! Ride completed.");

      setTimeout(() => {
        navigate("/ride/payment", {
          state: ride,
        });
      }, 3000);
    };
    socket.on("driver-location", onDriverLoc);
    socket.on("share-your-location", onShareLocation);
    socket.on("ride-started", onRideStarted);
    socket.on("ride-completed", onRideCompleted);

    return () => {
      socket.off("driver-location", onDriverLoc);
      socket.off("share-your-location", onShareLocation);
      socket.off("ride-started", onRideStarted);
      socket.off("ride-completed", onRideCompleted);
    };
  }, []);

  // Captain info (from populated ride object)
  const captain = ride.captain || {};
  const captainName = captain.fullname
    ? `${captain.fullname.firstname} ${captain.fullname.lastname || ""}`.trim()
    : "Your Captain";
  const plate = captain.vehicle?.plate || "—";
  const vehicleType = ride.vehicleType || captain.vehicle?.vehicleType || "Car";
  const rating = captain.rating || 4.9;

  // Default center: pickup coords or Mumbai
  const mapCenter = pickupCoords
    ? [pickupCoords.lat, pickupCoords.lng]
    : [19.076, 72.877];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* ── MAP ── */}
      <div className="h-[55vh] relative">
        <MapContainer
          center={mapCenter}
          zoom={14}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution=""
          />

          {/* Dashed route line */}
          {routeLine.length > 0 && (
            <Polyline
              positions={routeLine}
              color="#F5C518"
              weight={3}
              dashArray="10 8"
              opacity={0.5}
            />
          )}

          {/* Pickup marker */}
          {pickupCoords && (
            <Marker position={[pickupCoords.lat, pickupCoords.lng]} />
          )}

          {/* Destination marker */}
          {destCoords && <Marker position={[destCoords.lat, destCoords.lng]} />}

          {/* Live driver car icon */}
          {driverPos && (
            <>
              <Marker position={driverPos} icon={carIcon} />
              <MapPan position={driverPos} />
            </>
          )}
        </MapContainer>

        {/* Status badge */}
        <div
          className={`absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/85 backdrop-blur border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-semibold whitespace-nowrap ${statusColor}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${completed ? "bg-green-400" : "bg-[#F5C518] animate-pulse"}`}
          />
          {statusMsg}
        </div>

        {/* ETA bubble */}
        {etaMin !== null && !completed && (
          <div
            className="absolute bottom-6 right-4 z-[1000] bg-[#F5C518] text-black px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {etaMin} min away
          </div>
        )}

        {/* No location yet */}
        {!driverPos && !completed && (
          <div className="absolute bottom-6 left-4 z-[1000] bg-black/70 text-[#888] px-3 py-2 rounded-xl text-xs">
            Waiting for driver GPS...
          </div>
        )}
      </div>

      {/* ── BOTTOM PANEL ── */}
      <div className="flex-1 bg-[#0A0A0A] rounded-t-3xl -mt-3 relative z-10 px-4 pt-5 pb-6">
        {completed ? (
          <div className="flex flex-col items-center py-6">
            <CheckCircle size={56} className="text-green-400 mb-3" />
            <h2
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Ride Complete!
            </h2>
            <p className="text-[#555] text-sm">Thanks for riding with us 🎉</p>
            {ride.fare && (
              <p
                className="text-3xl font-extrabold text-[#F5C518] mt-4"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                ₹{ride.fare}
              </p>
            )}
            <p className="text-[#555] text-xs mt-1">Total fare paid</p>
          </div>
        ) : (
          <>
            {/* Driver card */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F5C518] flex items-center justify-center text-3xl flex-shrink-0">
                👨‍✈️
              </div>
              <div className="flex-1">
                <p
                  className="font-bold text-lg leading-tight"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {captainName}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[#666]">
                  <span className="flex items-center gap-1 text-[#F5C518]">
                    <Star size={11} fill="#F5C518" /> {rating}
                  </span>
                  <span>·</span>
                  <span className="capitalize">{vehicleType}</span>
                  <span>·</span>
                  <span className="uppercase font-mono">{plate}</span>
                </div>
              </div>
              {etaMin && (
                <div className="text-right flex-shrink-0">
                  <p className="text-[#555] text-xs">ETA</p>
                  <p
                    className="text-[#F5C518] font-bold text-lg"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {etaMin} min
                  </p>
                </div>
              )}
            </div>

            {/* Route card */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 mb-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F5C518]" />
                  <div className="w-px flex-1 bg-[#2a2a2a] my-1.5" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-white" />
                </div>
                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <p className="text-xs text-[#555]">Pickup</p>
                    <p className="text-sm text-[#ccc] truncate">
                      {ride.pickup || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#555]">Destination</p>
                    <p className="text-sm text-[#ccc] truncate">
                      {ride.destination || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fare + call row */}
            <div className="flex gap-3">
              <div className="flex-1 bg-[#111] border border-[#1e1e1e] rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-[#555] text-sm">Fare</span>
                <span
                  className="text-[#F5C518] font-bold text-lg"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  ₹{ride.fare || "—"}
                </span>
              </div>
              {captain.phone && (
                <a
                  href={`tel:${captain.phone}`}
                  className="w-14 h-14 bg-[#111] border border-[#1e1e1e] rounded-2xl flex items-center justify-center hover:border-[#F5C518] transition flex-shrink-0"
                >
                  <Phone size={20} className="text-[#F5C518]" />
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
