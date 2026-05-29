import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, MapPin, Navigation } from "lucide-react";

export default function RideConfirmed() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ride = state;

  useEffect(() => {
    // Auto-redirect to tracking after a moment
    const t = setTimeout(() => navigate("/ride/tracking", { state: ride }), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4">
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-[#F5C518]/10 absolute inset-0 animate-ping" />
        <div className="relative w-28 h-28 rounded-full bg-[#111] border-2 border-[#F5C518] flex items-center justify-center">
          <CheckCircle size={48} className="text-[#F5C518]" />
        </div>
      </div>

      <p className="section-label text-center">Ride booked</p>
      <h1 className="text-3xl font-extrabold text-center mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
        Driver is on the way!
      </h1>
      <p className="text-[#555] text-sm text-center mb-8">Redirecting to live tracking in a moment...</p>

      {ride && (
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 w-full max-w-sm mb-6">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2 h-2 rounded-full bg-[#F5C518]" />
              <div className="w-px flex-1 bg-[#2a2a2a] my-1" />
              <div className="w-2 h-2 rounded-sm bg-white" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-[#ccc]">{ride.pickup}</p>
              <p className="text-sm text-[#ccc]">{ride.destination}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate("/ride/tracking", { state: ride })}
        className="flex items-center gap-2 bg-[#F5C518] text-black font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-400 active:scale-95 transition"
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        <Navigation size={18} /> Track My Ride
      </button>
    </div>
  );
}
