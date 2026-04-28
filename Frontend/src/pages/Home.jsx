import { useState } from "react";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const handleRide = async () => {
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
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Book a Ride 🚕</h2>

      <div className="bg-white p-4 rounded-xl shadow-md max-w-md">
        <input
          className="input"
          placeholder="Pickup location"
          onChange={(e) => setPickup(e.target.value)}
        />

        <input
          className="input"
          placeholder="Destination"
          onChange={(e) => setDestination(e.target.value)}
        />

        <button onClick={handleRide} className="btn">
          Find Ride
        </button>
      </div>
    </div>
  );
}