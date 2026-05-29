import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import socket from "../socket";
import { toast } from "react-toastify";
import { Phone, MessageSquare, Star, Navigation } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapCenter({ position }) {
  const map = useMap();
  useEffect(() => { if (position) map.panTo(position); }, [position]);
  return null;
}

export default function RideTracking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ride = state || {};

  const [driverPos, setDriverPos] = useState(null);
  const [status, setStatus] = useState("Driver is on the way...");
  const [eta, setEta] = useState("~5 min");

  const pickup = ride.pickupCoords || { lat: 28.6139, lng: 77.209 };
  const destination = ride.destinationCoords || { lat: 28.7041, lng: 77.1025 };

  const route = Array.from({ length: 20 }, (_, i) => [
    pickup.lat + ((destination.lat - pickup.lat) * i) / 19,
    pickup.lng + ((destination.lng - pickup.lng) * i) / 19,
  ]);

  useEffect(() => {
    socket.on("driver-location", (loc) => {
      setDriverPos([loc.lat, loc.lng]);
    });

    socket.on("ride-started", () => {
      setStatus("Ride in progress 🚗");
      toast.info("Your ride has started!");
    });

    socket.on("ride-completed", () => {
      setStatus("Ride completed ✅");
      toast.success("Ride completed!");
      setTimeout(() => navigate("/home"), 2000);
    });

    return () => {
      socket.off("driver-location");
      socket.off("ride-started");
      socket.off("ride-completed");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Map */}
      <div className="h-[55vh] relative">
        <MapContainer
          center={[pickup.lat, pickup.lng]}
          zoom={13}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution=""
          />
          {driverPos && <Marker position={driverPos} icon={carIcon} />}
          {driverPos && <MapCenter position={driverPos} />}
          <Marker position={[pickup.lat, pickup.lng]} />
          <Marker position={[destination.lat, destination.lng]} />
          <Polyline positions={route} color="#F5C518" weight={3} dashArray="8,6" />
        </MapContainer>

        {/* Status badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur border border-[#F5C518]/30 text-[#F5C518] text-xs font-semibold px-4 py-2 rounded-full z-[1000] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse" />
          {status}
        </div>
      </div>

      {/* Bottom panel */}
      <div className="flex-1 bg-[#0A0A0A] rounded-t-3xl -mt-4 relative z-10 px-4 pt-6 pb-4">
        {/* Driver info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F5C518] flex items-center justify-center text-2xl flex-shrink-0">
            👨‍✈️
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>Your Captain</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[#F5C518] text-sm flex items-center gap-1"><Star size={12} fill="#F5C518" /> 4.9</span>
              <span className="text-[#555] text-xs">· {ride.vehicleType || "Car"} · {ride.captain?.vehicle?.plate || "XX-00-XX-0000"}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#555] text-xs">ETA</p>
            <p className="text-[#F5C518] font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{eta}</p>
          </div>
        </div>

        {/* Route info */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 mb-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F5C518]" />
              <div className="w-px flex-1 bg-[#2a2a2a] my-1.5" />
              <div className="w-2.5 h-2.5 rounded-sm bg-white" />
            </div>
            <div className="space-y-3 flex-1">
              <p className="text-sm text-[#ccc]">{ride.pickup || "Pickup location"}</p>
              <p className="text-sm text-[#ccc]">{ride.destination || "Destination"}</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-[#111] border border-[#1e1e1e] hover:border-[#333] text-white rounded-xl py-3 transition">
            <Phone size={18} className="text-[#F5C518]" /> Call Driver
          </button>
          <button className="flex items-center justify-center gap-2 bg-[#111] border border-[#1e1e1e] hover:border-[#333] text-white rounded-xl py-3 transition">
            <MessageSquare size={18} className="text-[#F5C518]" /> Message
          </button>
        </div>

        {/* Fare */}
        {ride.fare && (
          <div className="mt-4 flex justify-between items-center bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3">
            <span className="text-[#555] text-sm">Total fare</span>
            <span className="text-[#F5C518] font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>₹{ride.fare}</span>
          </div>
        )}
      </div>
    </div>
  );
}
