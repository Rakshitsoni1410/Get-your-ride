import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function RideSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("car");
  const [loading, setLoading] = useState(false);

  const rides = [
    { type: "car", price: 120 },
    { type: "bike", price: 60 },
    { type: "auto", price: 90 }
  ];

  const confirmRide = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/ride/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          pickup: state.pickup,
          destination: state.destination,
          vehicleType: selected
        })
      });

      const data = await res.json();

      if (data.ride) {
        navigate("/ride/searching", { state: { ride: data.ride } });
      } else {
        toast.error("Ride failed");
      }

    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">

      <h1 className="text-xl mb-4">Choose Ride</h1>

      {rides.map((r) => (
        <div
          key={r.type}
          onClick={() => setSelected(r.type)}
          className={`p-4 mb-3 rounded-xl cursor-pointer ${
            selected === r.type ? "bg-white/20" : "bg-gray-800"
          }`}
        >
          {r.type} - ₹{r.price}
        </div>
      ))}

      <button onClick={confirmRide} className="btn mt-4">
        {loading ? "Booking..." : "Confirm Ride"}
      </button>

    </div>
  );
}