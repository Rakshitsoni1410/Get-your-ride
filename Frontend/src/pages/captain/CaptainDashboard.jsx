import { useEffect, useState } from "react";
import socket from "../../socket";
import { toast } from "react-toastify";

let watchId = null; // 🔥 GLOBAL

export default function CaptainDashboard() {
  const [ride, setRide] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const captainId = localStorage.getItem("captainId");
  const token = localStorage.getItem("token");

  // 🔥 JOIN SOCKET
  useEffect(() => {
    if (!captainId) return;

    socket.emit("join", { userId: captainId, role: "captain" });

    socket.on("new-ride", (data) => {
      setRide(data);
      toast.info("New ride request 🚕");
    });

    return () => socket.off("new-ride");
  }, [captainId]);

  // 🚀 ONLINE
  const goOnline = () => {
    socket.emit("captain-online", captainId);
    setIsOnline(true);
    toast.success("You are ONLINE 🟢");
  };

  // 🔴 OFFLINE
  const goOffline = () => {
    setIsOnline(false);
    setRide(null);
    stopLocationSharing();
    toast.info("You are OFFLINE 🔴");
  };

  // 📍 START TRACKING
  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation not supported");
    }

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        socket.emit("driver-location", location); // 🔥 FIXED
      },
      () => toast.error("Location error"),
      { enableHighAccuracy: true }
    );
  };

  // 🛑 STOP TRACKING
  const stopLocationSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  };

  // 🚗 ACCEPT RIDE
const acceptRide = async () => {
  try {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 🔥 HARD CHECK
    if (role !== "captain") {
      return toast.error("You are not captain ❌");
    }

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

      toast.success("Ride accepted 🚗");

      startLocationSharing(data.ride._id);

      socket.emit("accept-ride", {
        rideId: data.ride._id,
        userId: data.ride.user,
        captainId,
      });

    } else {
      toast.error(data.message || "Failed to accept ride");
    }

  } catch (err) {
    console.error(err);
    toast.error("Error accepting ride");
  }
};
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl mb-4">Captain Dashboard 🚗</h1>

      <button
        onClick={isOnline ? goOffline : goOnline}
        className={`w-full py-3 rounded-xl mb-4 ${
          isOnline ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isOnline ? "Go Offline 🔴" : "Go Online 🟢"}
      </button>

      {!isOnline && <p className="text-center">Go online to get rides</p>}

      {ride && (
        <div className="bg-gray-800 p-4 rounded-xl">
          <p>📍 {ride.pickup}</p>
          <p>🏁 {ride.destination}</p>

          <button
            onClick={acceptRide}
            className="w-full mt-3 bg-green-500 py-2 rounded"
          >
            Accept Ride
          </button>
        </div>
      )}

      {activeRide && (
        <div className="bg-green-900 p-4 rounded-xl mt-4">
          Ride in Progress 🚕
        </div>
      )}
    </div>
  );
}