import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => navigate("/"));
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Profile 👤</h1>

        <div className="bg-gray-800 p-4 rounded-xl space-y-2">
          <p>
            {user.fullname.firstname} {user.fullname.lastname}
          </p>
          <p className="text-gray-400">{user.email}</p>
        </div>

        <button onClick={logout} className="btn mt-4 bg-red-500">
          Logout
        </button>
      </div>

      <UserNavbar />
    </div>
  );
}
