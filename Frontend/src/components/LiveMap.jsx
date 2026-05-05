import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

// 🔥 FIX ICON
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🚗 CAR ICON
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [40, 40],
});

export default function LiveMap({ driverLocation, pickup, destination }) {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (!driverLocation || !pickup || !destination) return;

    const points = [];
    const steps = 60;

    let start;
    let end;

    // 🔥 LOGIC: DRIVER → PICKUP → DESTINATION
    const distanceToPickup = Math.sqrt(
      Math.pow(driverLocation.lat - pickup.lat, 2) +
      Math.pow(driverLocation.lng - pickup.lng, 2)
    );

    // 👉 if driver far → go to pickup
    if (distanceToPickup > 0.002) {
      start = driverLocation;
      end = pickup;
    } 
    // 👉 if driver reached pickup → go to destination
    else {
      start = pickup;
      end = destination;
    }

    for (let i = 0; i <= steps; i++) {
      const lat = start.lat + ((end.lat - start.lat) * i) / steps;
      const lng = start.lng + ((end.lng - start.lng) * i) / steps;

      points.push([lat, lng]);
    }

    setRoute(points);
  }, [driverLocation, pickup, destination]);

  const center = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : [pickup?.lat || 23.0225, pickup?.lng || 72.5714];

  return (
    <MapContainer center={center} zoom={14} className="h-[500px] w-full rounded-xl">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 🚗 DRIVER */}
      {driverLocation && (
        <Marker
          position={[driverLocation.lat, driverLocation.lng]}
          icon={carIcon}
        />
      )}

      {/* 📍 PICKUP */}
      {pickup && <Marker position={[pickup.lat, pickup.lng]} />}

      {/* 🏁 DESTINATION */}
      {destination && <Marker position={[destination.lat, destination.lng]} />}

      {/* 🛣 ROUTE */}
      {route.length > 0 && <Polyline positions={route} />}
    </MapContainer>
  );
}