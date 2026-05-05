import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LiveMap({ driverLocation, pickup, destination }) {
  const [route, setRoute] = useState([]);

  // 🔥 FETCH ROUTE FROM API
  const getRoute = async (start, end) => {
    try {
      const res = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          params: {
            api_key: "YOUR_API_KEY", // 🔥 replace
            start: `${start.lng},${start.lat}`,
            end: `${end.lng},${end.lat}`,
          },
        }
      );

      const coords =
        res.data.features[0].geometry.coordinates.map((c) => [c[1], c[0]]);

      setRoute(coords);
    } catch (err) {
      console.error("Route error", err);
    }
  };

  // 🔥 UPDATE ROUTE
  useEffect(() => {
    if (!driverLocation || !pickup) return;

    // 🚗 Driver → Pickup
    getRoute(driverLocation, pickup);

  }, [driverLocation]);

  const center = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : [23.0225, 72.5714];

  return (
    <MapContainer center={center} zoom={13} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* DRIVER */}
      {driverLocation && (
        <Marker position={[driverLocation.lat, driverLocation.lng]} />
      )}

      {/* PICKUP */}
      {pickup && (
        <Marker position={[pickup.lat, pickup.lng]} />
      )}

      {/* DESTINATION */}
      {destination && (
        <Marker position={[destination.lat, destination.lng]} />
      )}

      {/* ROUTE LINE */}
      {route.length > 0 && <Polyline positions={route} />}
    </MapContainer>
  );
}