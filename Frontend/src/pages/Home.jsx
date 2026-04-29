import { useState } from "react";
import { toast } from "react-toastify";
import UserNavbar from "../components/UserNavbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!pickup || !destination) {
      return toast.error("Enter pickup & destination");
    }

    navigate("/ride/select", {
      state: { pickup, destination },
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black px-4">

      <div className="flex items-center justify-center flex-1">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-3xl shadow-2xl p-6">

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Get Your Ride 🚗</h1>
            <p className="text-sm text-gray-300">Fast • Safe • Comfortable</p>
          </div>

          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Pickup location"
            className="input mt-3"
          />

          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination"
            className="input mt-3"
          />

          <button onClick={handleNext} className="btn mt-5">
            Find Ride
          </button>

        </div>
      </div>

      <UserNavbar />
    </div>
  );
}