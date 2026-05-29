import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import UserNavbar from "../components/UserNavbar";
import { MapPin, Flag, ChevronRight, X } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <div className="flex-1 flex flex-col px-4 pt-10 pb-4">
        <button onClick={() => navigate("/home")} className="flex items-center gap-1 text-[#666] hover:text-white transition mb-6 text-sm">
          <X size={16} /> Cancel
        </button>

        <p className="section-label">Review</p>
        <h1 className="text-3xl font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Confirm your ride</h1>

        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
          <p className="text-xs text-[#555] uppercase tracking-widest mb-4 font-semibold">Route</p>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-[#F5C518]" />
              <div className="w-0.5 flex-1 bg-[#2a2a2a] my-2" />
              <div className="w-3 h-3 rounded-sm bg-white" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-[#555] mb-0.5">Pickup</p>
                <p className="text-white font-medium text-sm">{pickup}</p>
              </div>
              <div>
                <p className="text-xs text-[#555] mb-0.5">Destination</p>
                <p className="text-white font-medium text-sm">{destination}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-6">
          <p className="text-xs text-[#555] uppercase tracking-widest mb-3 font-semibold">Ride details</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-[#F5C518] font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>~5 km</p><p className="text-[#555] text-xs">Distance</p></div>
            <div><p className="text-[#F5C518] font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>~12 min</p><p className="text-[#555] text-xs">Est. time</p></div>
            <div><p className="text-[#F5C518] font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>₹100+</p><p className="text-[#555] text-xs">Est. fare</p></div>
          </div>
        </div>

        <button
          onClick={() => navigate("/ride/select", { state: { pickup, destination } })}
          className="btn flex items-center justify-center gap-2"
        >
          Choose Vehicle <ChevronRight size={18} />
        </button>
      </div>
      <UserNavbar />
    </div>
  );
}
