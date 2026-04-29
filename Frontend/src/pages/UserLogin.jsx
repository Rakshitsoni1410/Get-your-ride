import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // 🔥 auto redirect based on role
        if (data.role === "captain") {
          navigate("/captain/dashboard");
        } else {
          navigate("/home");
        }

      } else {
        alert(data.message || "Login failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

      <div className="card">

        <h1 className="title">Get Your Ride 🚗</h1>
        <p className="subtitle">Welcome back, login to continue</p>

        <input
          className="input mt-6"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="btn">
          Login
        </button>

        <p className="text-sm text-center mt-5 text-gray-300">
          Don’t have account?{" "}
          <Link to="/signup" className="text-white font-semibold">
            Signup
          </Link>
        </p>

        <p className="text-sm text-center mt-2">
          Captain?{" "}
          <Link to="/captain/signup" className="text-blue-400 font-semibold">
            Join as Captain
          </Link>
        </p>

      </div>
    </div>
  );
}