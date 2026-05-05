import { useEffect, useState } from "react";
import socket from "../socket";
import { useLocation } from "react-router-dom";
import LiveMap from "../components/LiveMap";

export default function RideTracking() {
  const [driverLocation, setDriverLocation] = useState(null);
  const { state } = useLocation();

  const ride = state;

  useEffect(() => {
    socket.on("driver-location", (location) => {
      setDriverLocation(location);
    });

    return () => socket.off("driver-location");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">

      <h1 className="text-xl mb-4">Driver is coming 🚗</h1>

      <LiveMap
        driverLocation={driverLocation}
        pickup={ride?.pickupCoords}
        destination={ride?.destinationCoords}
      />

    </div>
  );
}