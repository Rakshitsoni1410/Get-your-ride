import { useEffect, useState } from "react";
import socket from "../../socket";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MapPin, Flag, DollarSign, Clock, User, LogOut, Car } from "lucide-react";

let watchId = null;

export default function CaptainDashboard() {
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [ridesCount, setRidesCount] = useState(0);

  const captainId = localStorage.getItem("captainId");

  useEffect(() => {
    if (!captainId) return;
    socket.emit("join", { userId: captainId, role: "captain" });
    socket.on("new-ride", (data) => {
      setRide(data);
      toast.info("🚕 New ride request!");
    });
    return () => socket.off("new-ride");
  }, [captainId]);

  const goOnline = () => {
    socket.emit("captain-online", captainId);
    setIsOnline(true);
    toast.success("You're online! 🟢");
  };

  const goOffline = () => {
    setIsOnline(false);
    setRide(null);
    stopTracking();
    toast.info("You're offline 🔴");
  };

  const startTracking = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    watchId = navigator.geolocation.watchPosition(
      (pos) => socket.emit("driver-location", { lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => toast.error("Location error"),
      { enableHighAccuracy: true }
    );
  };

  const stopTracking = () => {
    if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null; }
  };

  const acceptRide = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/ride/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ rideId: ride._id }),
      });
      const data = await res.json();
      if (res.ok && data.ride) {
        setActiveRide(data.ride);
        setRide(null);
        toast.success("Ride accepted! 🚗");
        startTracking();
        socket.emit("accept-ride", { rideId: data.ride._id, userId: data.ride.user, captainId });
        setRidesCount((p) => p + 1);
        setEarnings((p) => p + (data.ride.fare || 100));
      } else {
        toast.error(data.message || "Failed to accept");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const rejectRide = () => {
    setRide(null);
    toast.info("Ride rejected");
  };

  const completeRide = () => {
    socket.emit("ride-completed", { rideId: activeRide._id });
    setActiveRide(null);
    stopTracking();
    toast.success("Ride completed! ✅");
  };

  const logout = () => {
    stopTracking();
    localStorage.clear();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C518] flex items-center justify-center">
              <Car size={20} className="text-black" />
            </div>
            <div>
              <p className="font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>Captain Dashboard</p>
              <p className="text-[#555] text-xs">GetYourRide</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/captain/profile")} className="w-9 h-9 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center hover:border-[#333] transition">
              <User size={16} className="text-[#888]" />
            </button>
            <button onClick={logout} className="w-9 h-9 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center hover:border-red-500/50 transition">
              <LogOut size={16} className="text-[#888]" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: DollarSign, label: "Earnings", value: `₹${earnings}` },
            { icon: Car, label: "Rides", value: ridesCount },
            { icon: Clock, label: "Status", value: isOnline ? "Online" : "Offline" },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-3 text-center">
              <p className="text-lg font-bold text-[#F5C518]" style={{ fontFamily: 'Syne, sans-serif' }}>{s.value}</p>
              <p className="text-[#555] text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Online toggle */}
        <button
          onClick={isOnline ? goOffline : goOnline}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${
            isOnline
              ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
              : "bg-[#F5C518] text-black hover:bg-yellow-400"
          }`}
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-red-400" : "bg-black"}`} />
          {isOnline ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4">
        {!isOnline && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🚗</span>
            <p className="text-[#555] text-sm">Go online to start receiving ride requests</p>
          </div>
        )}

        {isOnline && !ride && !activeRide && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#F5C518]/30 border-t-[#F5C518] animate-spin mb-6" />
            <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Waiting for rides</p>
            <p className="text-[#555] text-sm">You'll be notified when a request comes in</p>
          </div>
        )}

        {/* New ride request */}
        {ride && (
          <div className="bg-[#111] border border-[#F5C518]/30 rounded-2xl p-5 animate-pulse-once">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse" />
              <p className="text-xs font-bold text-[#F5C518] uppercase tracking-widest">New Ride Request</p>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex flex-col items-center pt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F5C518]" />
                <div className="w-px flex-1 bg-[#2a2a2a] my-1.5" />
                <div className="w-2.5 h-2.5 rounded-sm bg-white" />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs text-[#555]">Pickup</p>
                  <p className="text-white text-sm font-medium">{ride.pickup}</p>
                </div>
                <div>
                  <p className="text-xs text-[#555]">Destination</p>
                  <p className="text-white text-sm font-medium">{ride.destination}</p>
                </div>
              </div>
            </div>

            {(ride.fare || ride.distance) && (
              <div className="flex gap-3 mb-4">
                {ride.distance && (
                  <div className="flex-1 bg-[#1a1a1a] rounded-xl p-3 text-center">
                    <p className="text-[#F5C518] font-bold">{ride.distance} km</p>
                    <p className="text-[#555] text-xs">Distance</p>
                  </div>
                )}
                {ride.fare && (
                  <div className="flex-1 bg-[#1a1a1a] rounded-xl p-3 text-center">
                    <p className="text-[#F5C518] font-bold">₹{ride.fare}</p>
                    <p className="text-[#555] text-xs">Fare</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={rejectRide} className="py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 transition">
                Reject
              </button>
              <button onClick={acceptRide} className="py-3 rounded-xl bg-[#F5C518] text-black font-bold hover:bg-yellow-400 active:scale-95 transition" style={{ fontFamily: 'Syne, sans-serif' }}>
                Accept
              </button>
            </div>
          </div>
        )}

        {/* Active ride */}
        {activeRide && (
          <div className="bg-[#111] border border-green-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Ride In Progress</p>
            </div>

            <div className="flex gap-3 mb-5">
              <div className="flex flex-col items-center pt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F5C518]" />
                <div className="w-px flex-1 bg-[#2a2a2a] my-1.5" />
                <div className="w-2.5 h-2.5 rounded-sm bg-white" />
              </div>
              <div className="space-y-3 flex-1">
                <p className="text-white text-sm">{activeRide.pickup}</p>
                <p className="text-white text-sm">{activeRide.destination}</p>
              </div>
            </div>

            <button onClick={completeRide} className="w-full py-3.5 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 active:scale-95 transition" style={{ fontFamily: 'Syne, sans-serif' }}>
              Complete Ride ✅
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
