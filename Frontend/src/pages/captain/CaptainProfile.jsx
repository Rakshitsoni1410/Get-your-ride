import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CaptainProfile() {
  const [captain, setCaptain] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/captain/me", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.captain) {
          setCaptain(data.captain);
        } else {
          toast.error("Unauthorized");
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Error loading profile");
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate("/");
  };

  if (!captain) return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-400"
      >
        ← Back
      </button>
      <h1 className="text-xl font-bold mb-6">Captain Profile 👤</h1>

      <div className="bg-gray-800 p-6 rounded-2xl space-y-3">
        <p>
          <strong>Name:</strong> {captain.fullname.firstname}{" "}
          {captain.fullname.lastname}
        </p>
        <p>
          <strong>Email:</strong> {captain.email}
        </p>
        <p>
          <strong>Phone:</strong> {captain.phone}
        </p>

        <hr className="border-gray-600 my-3" />

        <p>
          <strong>Vehicle:</strong> {captain.vehicle.vehicleType}
        </p>
        <p>
          <strong>Plate:</strong> {captain.vehicle.plate}
        </p>
        <p>
          <strong>Color:</strong> {captain.vehicle.color}
        </p>
      </div>

      <button onClick={handleLogout} className="btn mt-6 w-full bg-red-500">
        Logout
      </button>
    </div>
  );
}
