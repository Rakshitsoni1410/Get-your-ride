import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, Navigation } from "lucide-react";

export default function RideConfirmed() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ride = state;

  useEffect(() => {
    const t = setTimeout(
      () => navigate("/ride/tracking", { state: ride }),
      3000,
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="relative mb-8">
        <div
          className="w-28 h-28 rounded-full absolute inset-0 animate-ping"
          style={{
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
          }}
        />
        <div
          className="relative w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            background: "var(--bg-card)",
            border: "2px solid var(--accent)",
          }}
        >
          <CheckCircle size={48} style={{ color: "var(--accent)" }} />
        </div>
      </div>

      <p className="section-label text-center">Ride booked</p>
      <h1
        className="text-3xl font-extrabold text-center mb-3"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Driver is on the way!
      </h1>
      <p
        className="text-sm text-center mb-8"
        style={{ color: "var(--text-muted)" }}
      >
        Redirecting to live tracking in a moment...
      </p>

      {ride && (
        <div
          className="rounded-2xl p-5 w-full max-w-sm mb-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
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
            <div className="space-y-3">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {ride.pickup}
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {ride.destination}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate("/ride/tracking", { state: ride })}
        className="flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl transition active:scale-95"
        style={{
          fontFamily: "Syne, sans-serif",
          background: "var(--accent)",
          color: "var(--accent-text)",
        }}
      >
        <Navigation size={18} /> Track My Ride
      </button>
    </div>
  );
}
