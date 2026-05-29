import { useEffect, useState } from "react";
import socket from "../../socket";
import { toast } from "react-toastify";

let watchId = null; // 🔥 global tracker

export default function CaptainDashboard() {
  const [ride, setRide] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const captainId = localStorage.getItem("captainId");
  const token = localStorage.getItem("token");

  // 🔥 SOCKET JOIN
  useEffect(() => {
    if (!captainId) return;

    socket.emit("join", { userId: captainId, role: "captain" });

    const handleNewRide = (data) => {
      setRide(data);
      toast.info("New ride request 🚕");
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [captainId]);

  // 🟢 GO ONLINE
  const goOnline = () => {
    socket.emit("captain-online", captainId);
    setIsOnline(true);
    toast.success("You are ONLINE 🟢");
  };

  // 🔴 GO OFFLINE
  const goOffline = () => {
    setIsOnline(false);
    setRide(null);
    stopLocationSharing();
    toast.info("You are OFFLINE 🔴");
  };

  // 📍 START LIVE LOCATION
  const startLocationSharing = (rideId) => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation not supported");
    }

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        // ✅ CORRECT EVENT
        socket.emit("captain-location", {
          rideId,
          location,
        });
      },
      () => toast.error("Location error"),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  };

  // 🛑 STOP LOCATION
  const stopLocationSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  };

  // 🚗 ACCEPT RIDE
  const acceptRide = async () => {
    try {
      if (!ride) return;

      const res = await fetch("http://localhost:5000/api/ride/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, // ✅ correct token
        },
        body: JSON.stringify({ rideId: ride._id }),
      });

      const data = await res.json();

      if (res.ok && data.ride) {
        setActiveRide(data.ride);
        setRide(null);

        toast.success("Ride accepted 🚗");

        // ✅ START GPS
        startLocationSharing(data.ride._id);

        // ✅ NOTIFY USER
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
      <h1 className="text-2xl mb-4 font-bold">
        Captain Dashboard 🚗
      </h1>

      {/* ONLINE BUTTON */}
      <button
        onClick={isOnline ? goOffline : goOnline}
        className={`w-full py-3 rounded-xl mb-4 ${
          isOnline ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isOnline ? "Go Offline 🔴" : "Go Online 🟢"}
      </button>

      {/* OFFLINE STATE */}
      {!isOnline && (
        <p className="text-center text-gray-400 mt-10">
          Go online to receive rides
        </p>
      )}

      {/* NEW RIDE */}
      {isOnline && ride && (
        <div className="bg-gray-800 p-4 rounded-xl mb-4">
          <p className="text-lg font-semibold mb-2">
            New Ride Request 🚕
          </p>

          <p className="text-sm text-gray-300">📍 {ride.pickup}</p>
          <p className="text-sm text-gray-300">🏁 {ride.destination}</p>

          <button
            onClick={acceptRide}
            className="w-full mt-4 py-2 bg-green-500 rounded-lg"
          >
            Accept Ride
          </button>
        </div>
      )}

      {/* ACTIVE RIDE */}
      {activeRide && (
        <div className="bg-green-900 p-4 rounded-xl">
          Ride in Progress 🚕
        </div>
      )}
    </div>
  );
}