import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import UserNavbar from "../components/UserNavbar"; // ✅ IMPORT

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

  const handleConfirm = () => {
    navigate("/ride/select", {
      state: { pickup, destination },
    });
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-black text-white">

      {/* 🔥 CENTER CONTENT */}
      <div className="flex items-center justify-center flex-1 px-4">

        <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">

          <h1 className="text-xl font-bold mb-4">
            Confirm Your Ride 🚗
          </h1>

          <div className="space-y-3 text-gray-300">
            <p>📍 Pickup: <span className="text-white">{pickup}</span></p>
            <p>🏁 Destination: <span className="text-white">{destination}</span></p>
          </div>

          <div className="flex gap-3 mt-6">

            <button
              onClick={handleCancel}
              className="w-1/2 bg-red-500 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className="w-1/2 bg-green-500 py-2 rounded-lg"
            >
              Confirm
            </button>

          </div>

        </div>

      </div>

      {/* ✅ NAVBAR */}
      <UserNavbar />

    </div>
  );
}