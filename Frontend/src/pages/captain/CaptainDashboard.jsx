import { useEffect, useState } from "react";
import socket from "../../socket";
import { toast } from "react-toastify";

export default function CaptainDashboard() {
  const [ride, setRide] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  // 🔥 CAPTAIN DATA
  const captainId = localStorage.getItem("captainId");
  const captainToken = localStorage.getItem("captainToken");

  // 🔥 SOCKET JOIN
  useEffect(() => {
    if (!captainId) return;

    socket.emit("join", { userId: captainId, role: "captain" });

    const handleRide = (data) => {
      setRide(data);
      toast.info("New ride request 🚕");
    };

    socket.on("new-ride", handleRide);

    return () => socket.off("new-ride", handleRide);
  }, [captainId]);

  // 🚀 GO ONLINE
  const goOnline = () => {
    if (!captainId) return toast.error("Login again");

    socket.emit("captain-online", captainId);
    setIsOnline(true);

    toast.success("You are now ONLINE 🟢");
  };

  // 🔴 GO OFFLINE
  const goOffline = () => {
    setIsOnline(false);
    setRide(null);

    toast.info("You are OFFLINE 🔴");
  };

  // 🚀 ACCEPT RIDE (🔥 FIXED)
  const acceptRide = async () => {
    try {
      if (!captainToken) {
        return toast.error("Captain not logged in");
      }

      const res = await fetch("http://localhost:5000/api/ride/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${captainToken}`, // 🔥 IMPORTANT FIX
        },
        body: JSON.stringify({ rideId: ride._id }),
      });

      const data = await res.json();

      if (res.ok && data.ride) {
        setActiveRide(data.ride);
        setRide(null);

        toast.success("Ride accepted 🚗");

        socket.emit("accept-ride", {
          rideId: data.ride._id,
          userId: data.ride.user,
          captainId,
        });

        startLocationSharing(data.ride._id);
      } else {
        toast.error(data.message || "Failed to accept ride");
      }

    } catch (err) {
      console.error(err);
      toast.error("Error accepting ride");
    }
  };

  // 📍 LOCATION TRACKING
  const startLocationSharing = (rideId) => {
    navigator.geolocation.watchPosition((pos) => {
      socket.emit("captain-location", {
        rideId,
        location: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        },
      });
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Captain Dashboard 🚗</h1>

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
        <p className="text-gray-400 text-center mt-10">
          You are offline. Go online to receive rides.
        </p>
      )}

      {/* NEW RIDE */}
      {isOnline && ride && (
        <div className="bg-gray-800 p-4 rounded-xl mb-4">
          <p className="text-lg font-semibold">New Ride Request</p>

          <p className="text-sm text-gray-300 mt-2">📍 {ride.pickup}</p>
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