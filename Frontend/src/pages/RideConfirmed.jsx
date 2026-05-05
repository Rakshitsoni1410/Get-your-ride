import { useLocation, useNavigate } from "react-router-dom";

export default function RideConfirmed() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const ride = state;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-2xl mb-4">🎉 Ride Confirmed!</h1>

      <p>Driver is on the way 🚗</p>

      <button
        onClick={() => navigate("/ride/tracking", { state: ride })}
        className="mt-6 bg-green-500 px-4 py-2 rounded-lg"
      >
        Track Ride
      </button>

    </div>
  );
}