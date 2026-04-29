import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function LiveMap({ driverLocation }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY
  });

  if (!isLoaded) return <p className="text-white">Loading map...</p>;

  return (
    <GoogleMap
      center={driverLocation || { lat: 23.0225, lng: 72.5714 }} // Ahmedabad default
      zoom={14}
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      {driverLocation && <Marker position={driverLocation} />}
    </GoogleMap>
  );
}