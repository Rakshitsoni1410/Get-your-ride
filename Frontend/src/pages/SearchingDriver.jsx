import { useEffect } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

export default function SearchingDriver() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    socket.emit("join", { userId, role: "user" });

    socket.on("ride-accepted", (ride) => {
      navigate("/ride/confirmed", { state: ride });
    });

    return () => {
      socket.off("ride-accepted");
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-xl">Searching Driver 🚕</h1>
    </div>
  );
}