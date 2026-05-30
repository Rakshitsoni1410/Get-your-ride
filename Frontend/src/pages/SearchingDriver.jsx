import { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { X } from "lucide-react";

export default function SearchingDriver() {
  const navigate = useNavigate();
  const { state: rideData } = useLocation(); // rideData = { _id, pickup, destination, fare, vehicleType, pickupCoords, ... }
  const [elapsed, setElapsed] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return navigate("/");

    // Make sure user is in their own socket room so the server can reach them
    socket.emit("join", { userId, role: "user" });

    // ─── ride-accepted comes from the backend via socket ──────────────
    // The controller does: io.to(ride.user.toString()).emit("ride-accepted", populatedRide)
    const onAccepted = (ride) => {
      toast.success("Driver found! 🚗");
      // pass full ride object including captain info to tracking page
      navigate("/ride/tracking", { state: ride });
    };

    socket.on("ride-accepted", onAccepted);

    const timer    = setInterval(() => setElapsed((p) => p + 1), 1000);
    const dotTimer = setInterval(() => setDots((p) => (p.length >= 3 ? "." : p + ".")), 500);

    return () => {
      socket.off("ride-accepted", onAccepted);
      clearInterval(timer);
      clearInterval(dotTimer);
    };
  }, []);

  const cancelRide = () => {
    toast.info("Ride cancelled");
    navigate("/home");
  };

  const fmt = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4">
      {/* Pulsing ring animation */}
      <div className="relative mb-10">
        <div className="absolute inset-0 w-36 h-36 rounded-full bg-[#F5C518]/10 animate-ping" />
        <div className="absolute inset-0 w-36 h-36 rounded-full bg-[#F5C518]/15 animate-pulse" />
        <div className="relative w-36 h-36 rounded-full bg-[#111] border-2 border-[#F5C518]/30 flex items-center justify-center">
          <span className="text-6xl">🚕</span>
        </div>
      </div>

      <p className="section-label text-center">Please wait</p>
      <h1 className="text-3xl font-extrabold text-center mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
        Finding your driver{dots}
      </h1>
      <p className="text-[#555] text-sm text-center">Usually takes less than 2 minutes</p>

      {/* Live timer */}
      <div className="mt-6 bg-[#111] border border-[#1e1e1e] rounded-2xl px-10 py-4 text-center">
        <p className="text-4xl font-bold text-[#F5C518] tabular-nums" style={{ fontFamily: "Syne, sans-serif" }}>
          {fmt(elapsed)}
        </p>
        <p className="text-[#555] text-xs mt-1">time elapsed</p>
      </div>

      {/* Ride summary */}
      {rideData && (
        <div className="mt-5 bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 w-full max-w-sm">
          <p className="text-xs text-[#555] uppercase tracking-widest mb-3 font-semibold">Your ride</p>
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2 h-2 rounded-full bg-[#F5C518]" />
              <div className="w-px flex-1 bg-[#2a2a2a] my-1" />
              <div className="w-2 h-2 rounded-sm bg-white" />
            </div>
            <div className="space-y-3 flex-1">
              <p className="text-sm text-[#ccc]">{rideData.pickup}</p>
              <p className="text-sm text-[#ccc]">{rideData.destination}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1e1e1e] grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[#F5C518] font-bold text-sm">₹{rideData.fare}</p>
              <p className="text-[#555] text-xs">Fare</p>
            </div>
            <div>
              <p className="text-[#F5C518] font-bold text-sm">{rideData.distance} km</p>
              <p className="text-[#555] text-xs">Distance</p>
            </div>
            <div>
              <p className="text-[#F5C518] font-bold text-sm capitalize">{rideData.vehicleType}</p>
              <p className="text-[#555] text-xs">Vehicle</p>
            </div>
          </div>
        </div>
      )}

      <button onClick={cancelRide} className="mt-8 flex items-center gap-2 text-[#555] hover:text-red-400 transition text-sm">
        <X size={16} /> Cancel ride
      </button>
    </div>
  );
}
