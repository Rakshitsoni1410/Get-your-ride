import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import UserNavbar from "../components/UserNavbar";
import { ChevronRight, X } from "lucide-react";

export default function ConfirmRide() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { pickup, destination } = state || {};

  useEffect(() => {
    if (!pickup || !destination) {
      toast.error("No ride data found");
      navigate("/home");
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="flex-1 flex flex-col px-4 pt-10 pb-4">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-1 transition mb-6 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={16} /> Cancel
        </button>

        <p className="section-label">Review</p>
        <h1
          className="text-3xl font-extrabold mb-6"
          style={{
            fontFamily: "Syne, sans-serif",
            color: "var(--text-primary)",
          }}
        >
          Confirm your ride
        </h1>

        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-4 font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            Route
          </p>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <div
                className="w-0.5 flex-1 my-2"
                style={{ background: "var(--border-input)" }}
              />
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: "var(--text-primary)" }}
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p
                  className="text-xs mb-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Pickup
                </p>
                <p
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {pickup}
                </p>
              </div>
              <div>
                <p
                  className="text-xs mb-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Destination
                </p>
                <p
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {destination}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-3 font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            Ride details
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ["~5 km", "Distance"],
              ["~12 min", "Est. time"],
              ["₹100+", "Est. fare"],
            ].map(([v, l]) => (
              <div key={l}>
                <p
                  className="font-bold text-lg"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    color: "var(--accent)",
                  }}
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

        <button
          onClick={() =>
            navigate("/ride/select", { state: { pickup, destination } })
          }
          className="btn flex items-center justify-center gap-2"
        >
          Choose Vehicle <ChevronRight size={18} />
        </button>
      </div>
      <UserNavbar />
    </div>
  );
}
