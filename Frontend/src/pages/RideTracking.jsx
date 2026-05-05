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
    if (!pickup || !destination) return;

    const points = [];
    const steps = 60;

    for (let i = 0; i <= steps; i++) {
      const lat =
        pickup.lat + ((destination.lat - pickup.lat) * i) / steps;
      const lng =
        pickup.lng + ((destination.lng - pickup.lng) * i) / steps;

      points.push([lat, lng]);
    }

    setRoute(points);
  }, [pickup, destination]);

  const center = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : [pickup.lat, pickup.lng];

  return (
    <MapContainer center={center} zoom={13} className="h-[500px] w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {driverLocation && (
        <Marker position={[driverLocation.lat, driverLocation.lng]} icon={carIcon} />
      )}

      {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
      {destination && <Marker position={[destination.lat, destination.lng]} />}

      {route.length > 0 && <Polyline positions={route} />}
    </MapContainer>
  );
}