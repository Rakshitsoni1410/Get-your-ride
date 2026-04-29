import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ConfirmRide() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { pickup, destination } = state || {};

  const handleConfirm = () => {
    if (!pickup || !destination) {
      return toast.error("Ride details missing");
    }

    // 👉 go to ride creation page
    navigate("/ride/select", {
      state: { pickup, destination },
    });
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">

        <h1 className="text-xl font-bold mb-4">
          Confirm Your Ride 🚗
        </h1>

        <div className="space-y-3 text-gray-300">
          <p>
            📍 Pickup: <span className="text-white">{pickup}</span>
          </p>

          <p>
            🏁 Destination: <span className="text-white">{destination}</span>
          </p>
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
  );
}