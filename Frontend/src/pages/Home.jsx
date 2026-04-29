import { useState } from "react";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

      {/* Main Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-3xl shadow-2xl p-6">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-wide">
            Get Your Ride 🚗
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Fast • Safe • Comfortable
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-4">

          <div>
            <label className="text-xs text-gray-300">Pickup Location</label>
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup point"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300">Destination</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to go?"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

        </div>

        {/* Button */}
        <button className="w-full mt-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] active:scale-95 transition">
          Find Ride
        </button>

        {/* Info Card */}
        <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
          <p>💡 Tip: Enter accurate locations for better fare estimation</p>
        </div>

      </div>
    </div>
  );
}