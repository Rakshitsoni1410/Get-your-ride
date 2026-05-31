import { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { X, MapPin } from "lucide-react";

export default function SearchingDriver() {
  const navigate = useNavigate();
  const { state: rideData } = useLocation();
  const [elapsed, setElapsed] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return navigate("/");
    socket.emit("join", { userId, role: "user" });
    const onAccepted = (ride) => {
      toast.success("Driver found! 🚗");
      navigate("/ride/tracking", { state: ride });
    };
    socket.on("ride-accepted", onAccepted);
    const timer = setInterval(() => setElapsed((p) => p + 1), 1000);
    const dotTimer = setInterval(
      () => setDots((p) => (p.length >= 3 ? "." : p + ".")),
      500,
    );
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
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Pulsing ring */}
      <div className="relative mb-10">
        <div
          className="absolute inset-0 w-36 h-36 rounded-full animate-ping"
          style={{
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
          }}
        />
        <div
          className="absolute inset-0 w-36 h-36 rounded-full animate-pulse"
          style={{
            background: "color-mix(in srgb, var(--accent) 15%, transparent)",
          }}
        />
        <div
          className="relative w-36 h-36 rounded-full flex items-center justify-center"
          style={{
            background: "var(--bg-card)",
            border:
              "2px solid color-mix(in srgb, var(--accent) 30%, transparent)",
          }}
        >
          <span className="text-6xl">🚕</span>
        </div>
      </div>

      <p className="section-label text-center">Please wait</p>
      <h1
        className="text-3xl font-extrabold text-center mb-2"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Finding your driver{dots}
      </h1>
      <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
        Usually takes less than 2 minutes
      </p>

      <div
        className="mt-6 rounded-2xl px-10 py-4 text-center"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <p
          className="text-4xl font-bold tabular-nums"
          style={{ fontFamily: "Syne, sans-serif", color: "var(--accent)" }}
        >
          {fmt(elapsed)}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          time elapsed
        </p>
      </div>

      {rideData && (
        <div
          className="mt-5 rounded-2xl p-4 w-full max-w-sm"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-3 font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            Your ride
          </p>
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <div
                className="w-px flex-1 my-1"
                style={{ background: "var(--border-input)" }}
              />
              <div
                className="w-2 h-2 rounded-sm"
                style={{ background: "var(--text-primary)" }}
              />
            </div>
            <div className="space-y-3 flex-1">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {rideData.pickup}
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {rideData.destination}
              </p>
            </div>
          </div>
          <div
            className="mt-3 pt-3 grid grid-cols-3 gap-2 text-center"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            {[
              ["₹" + rideData.fare, "Fare"],
              [rideData.distance + " km", "Distance"],
              [rideData.vehicleType, "Vehicle"],
            ].map(([v, l]) => (
              <div key={l}>
                <p
                  className="font-bold text-sm capitalize"
                  style={{ color: "var(--accent)" }}
                >
                  {v}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={cancelRide}
        className="mt-8 flex items-center gap-2 transition text-sm"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--text-muted)")
        }
      >
        <X size={16} /> Cancel ride
      </button>
    </div>
  );
}
