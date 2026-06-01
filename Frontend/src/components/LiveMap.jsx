import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

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
  useEffect(() => {
    if (position) map.panTo(position);
  }, [position]);
  return null;
}

export default function LiveMap({ driverLocation, pickup, destination }) {
  const center = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : pickup
      ? [pickup.lat, pickup.lng]
      : [28.6139, 77.209];

  const route =
    pickup && destination
      ? Array.from({ length: 20 }, (_, i) => [
          pickup.lat + ((destination.lat - pickup.lat) * i) / 19,
          pickup.lng + ((destination.lng - pickup.lng) * i) / 19,
        ])
      : [];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution=""
      />
      {driverLocation && (
        <>
          <Marker
            position={[driverLocation.lat, driverLocation.lng]}
            icon={carIcon}
          />
          <MapCenter position={[driverLocation.lat, driverLocation.lng]} />
        </>
      )}
      {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
      {destination && <Marker position={[destination.lat, destination.lng]} />}
      {route.length > 0 && (
        <Polyline
          positions={route}
          color="#F5C518"
          weight={3}
          dashArray="8,6"
        />
      )}
    </MapContainer>
  );
}
