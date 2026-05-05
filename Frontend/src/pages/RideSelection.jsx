import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getDistance } from "geolib";

// 🔥 ICONS
import { Car, Bike, Truck, Clock, MapPin } from "lucide-react";

export default function RideSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState("car");
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(0);

  // 🚗 VEHICLE CONFIG
  const rideTypes = {
    car: {
      base: 50,
      perKm: 12,
      icon: <Car size={22} />,
      name: "Car",
      time: "5 min",
    },
    bike: {
      base: 30,
      perKm: 6,
      icon: <Bike size={22} />,
      name: "Bike",
      time: "3 min",
    },
    auto: {
      base: 40,
      perKm: 8,
      icon: <Truck size={22} />,
      name: "Auto",
      time: "4 min",
    },
  };

  // 🔥 MOCK DISTANCE (same as before)
  useEffect(() => {
    const dist = getDistance(
      { latitude: 23.0225, longitude: 72.5714 },
      { latitude: 23.0350, longitude: 72.5500 }
    );
    setDistance((dist / 1000).toFixed(2));
  }, []);

  const getPrice = (type) => {
    const { base, perKm } = rideTypes[type];
    return Math.round(base + distance * perKm);
  };

  const confirmRide = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/ride/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pickup: state.pickup,
          destination: state.destination,
          vehicleType: selected,
          distance,
          fare: getPrice(selected),
        }),
      });

      const data = await res.json();

      if (data.ride) {
        toast.success("Ride booked 🚕");
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">

      {/* 🔥 HEADER */}
      <h1 className="text-2xl font-bold mb-2">Choose your ride</h1>

      {/* 📍 ROUTE INFO */}
      <div className="bg-white/10 p-3 rounded-xl mb-4 text-sm">
        <p className="flex items-center gap-2 text-gray-300">
          <MapPin size={16} /> {state.pickup}
        </p>
        <p className="flex items-center gap-2 text-gray-400">
          → {state.destination}
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Distance: {distance} km
        </p>
      </div>

      {/* 🚗 RIDE OPTIONS */}
      {Object.entries(rideTypes).map(([key, ride]) => (
        <div
          key={key}
          onClick={() => setSelected(key)}
          className={`flex items-center justify-between p-4 mb-3 rounded-2xl cursor-pointer transition-all ${
            selected === key
              ? "bg-white text-black scale-105"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <div className="flex items-center gap-3">
            {ride.icon}
            <div>
              <p className="font-semibold">{ride.name}</p>
              <p className="text-xs opacity-70 flex items-center gap-1">
                <Clock size={14} /> {ride.time}
              </p>
            </div>
          </div>

          <p className="font-bold">₹{getPrice(key)}</p>
        </div>
      ))}

      {/* 🚀 BUTTON */}
      <button
        onClick={confirmRide}
        className="w-full mt-4 py-3 rounded-2xl bg-green-500 hover:bg-green-600 transition text-lg font-semibold"
      >
        {loading ? "Booking..." : `Confirm ${rideTypes[selected].name}`}
      </button>
    </div>
  );
}