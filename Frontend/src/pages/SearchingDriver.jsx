import { useEffect } from "react";
import socket from "../socket";
import { useNavigate, useLocation } from "react-router-dom";

export default function SearchingDriver() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    socket.emit("join", { userId, role: "user" });
    socket.on("ride-accepted", (ride) => {
      //  JOIN RIDE ROOM
      socket.emit("join", {
        userId: ride.rideId,
        role: "ride",
      });

      navigate("/ride/tracking", { state: ride });
    });

    return () => socket.off("ride-accepted");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <h1>Searching Driver 🚕</h1>
    </div>
  );
}
