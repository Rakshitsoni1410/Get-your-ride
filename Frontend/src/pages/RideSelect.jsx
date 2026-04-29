import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../socket";

export default function RideSelect() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { pickup, destination } = state || {};

  const createRide = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/ride/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ pickup, destination })
      });

      const data = await res.json();

      if (data.ride) {
        toast.success("Ride requested 🚕");

        // 🔥 THIS IS THE MISSING PART
        socket.emit("request-ride", data.ride);

        navigate("/ride/searching");
      } else {
        toast.error("Failed to create ride");
      }

    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="p-4 text-white bg-black min-h-screen">
      <h1>Select Ride</h1>

      <p>{pickup} → {destination}</p>

      <button onClick={createRide} className="btn mt-4">
        Confirm Ride
      </button>
    </div>
  );
}