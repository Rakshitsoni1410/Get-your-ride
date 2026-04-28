import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
      <div className="bg-white w-[350px] p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Login 🚗</h2>

        <input
          className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have account?{" "}
          <Link to="/signup" className="font-semibold">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}