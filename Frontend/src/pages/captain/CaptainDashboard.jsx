import { useState } from "react";
import { Link } from "react-router-dom";

export default function CaptainDashboard() {
  const [status, setStatus] = useState("offline");

  const toggleStatus = () => {
    setStatus(status === "offline" ? "online" : "offline");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Captain Dashboard 🚗</h1>

        <Link to="/captain/profile" className="text-sm text-blue-400">
          Profile
        </Link>
      </div>

      {/* STATUS CARD */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Status</h2>

        <p className={`mb-4 font-bold ${
          status === "online" ? "text-green-400" : "text-red-400"
        }`}>
          {status.toUpperCase()}
        </p>

        <button
          onClick={toggleStatus}
          className="btn w-full"
        >
          {status === "online" ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-400">Today's Rides</p>
          <h2 className="text-xl font-bold">0</h2>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-400">Earnings</p>
          <h2 className="text-xl font-bold">₹0</h2>
        </div>
      </div>

      {/* FUTURE: RIDE REQUEST */}
      <div className="mt-6 bg-gray-800 p-4 rounded-xl">
        <p className="text-gray-400 text-sm">
          🚗 Waiting for ride requests...
        </p>
      </div>

    </div>
  );
}