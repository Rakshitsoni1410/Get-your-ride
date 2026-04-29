import { useNavigate, useLocation } from "react-router-dom";

export default function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const active = (path) =>
    location.pathname === path ? "text-white" : "text-gray-400";

  return (
    <div className="bg-black border-t border-gray-800 flex justify-around py-3">

      <button
        onClick={() => navigate("/home")}
        className={`flex flex-col items-center text-sm ${active("/home")}`}
      >
        🏠 Home
      </button>

      <button
        onClick={() => navigate("/user/profile")}
        className={`flex flex-col items-center text-sm ${active("/user/profile")}`}
      >
        👤 Profile
      </button>

    </div>
  );
}