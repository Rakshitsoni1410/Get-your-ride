import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SearchingDriver() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fake delay (later replace with socket)
    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-2xl font-bold mb-4">
        Searching Driver 🚕
      </h1>

      {/* Loader */}
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

      <p className="mt-4 text-gray-400">
        Looking for nearby drivers...
      </p>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Pickup: {state?.ride?.pickup} <br />
        Destination: {state?.ride?.destination}
      </div>

    </div>
  );
}