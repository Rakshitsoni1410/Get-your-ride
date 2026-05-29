import { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { X } from "lucide-react";

export default function SearchingDriver() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [elapsed, setElapsed] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    socket.emit("join", { userId, role: "user" });

    socket.on("ride-accepted", (ride) => {
      toast.success("Driver found! 🚗");
      navigate("/ride/tracking", { state: ride });
    });

    // Timer
    const timer = setInterval(() => setElapsed((p) => p + 1), 1000);
    const dotTimer = setInterval(() => setDots((p) => (p.length >= 3 ? "." : p + ".")), 500);

    return () => {
      socket.off("ride-accepted");
      clearInterval(timer);
      clearInterval(dotTimer);
    };
  }, []);

  const cancelRide = () => {
    toast.info("Ride cancelled");
    navigate("/home");
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4">

      {/* Pulsing animation */}
      <div className="relative mb-10">
        <div className="w-32 h-32 rounded-full bg-[#F5C518]/10 animate-ping absolute inset-0" />
        <div className="w-32 h-32 rounded-full bg-[#F5C518]/20 animate-pulse absolute inset-0" />
        <div className="relative w-32 h-32 rounded-full bg-[#111] border border-[#F5C518]/40 flex items-center justify-center">
          <span className="text-5xl">🚕</span>
        </div>
      </div>

      <p className="section-label text-center">Please wait</p>
      <h1 className="text-3xl font-extrabold text-center mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
        Finding your driver{dots}
      </h1>
      <p className="text-[#555] text-sm text-center mb-2">This usually takes less than 2 minutes</p>

      {/* Timer */}
      <div className="mt-4 bg-[#111] border border-[#1e1e1e] rounded-2xl px-8 py-4 text-center">
        <p className="text-3xl font-bold text-[#F5C518] font-mono" style={{ fontFamily: 'Syne, sans-serif' }}>{formatTime(elapsed)}</p>
        <p className="text-[#555] text-xs mt-1">time elapsed</p>
      </div>

      {/* Ride info */}
      {state && (
        <div className="mt-6 bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 w-full max-w-sm">
          <p className="text-xs text-[#555] uppercase tracking-widest mb-3 font-semibold">Your ride</p>
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2 h-2 rounded-full bg-[#F5C518]" />
              <div className="w-px flex-1 bg-[#2a2a2a] my-1" />
              <div className="w-2 h-2 rounded-sm bg-white" />
            </div>
            <div className="space-y-3 flex-1">
              <p className="text-sm text-[#ccc]">{state.pickup}</p>
              <p className="text-sm text-[#ccc]">{state.destination}</p>
            </div>
          </div>
          {state.fare && (
            <div className="mt-3 pt-3 border-t border-[#1e1e1e] flex justify-between items-center">
              <span className="text-[#555] text-xs">Estimated fare</span>
              <span className="text-[#F5C518] font-bold">₹{state.fare}</span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={cancelRide}
        className="mt-8 flex items-center gap-2 text-[#555] hover:text-red-400 transition text-sm"
      >
        <X size={16} /> Cancel ride
      </button>
    </div>
  );
}
