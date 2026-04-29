import { Link } from "react-router-dom";

export default function UserLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

      <div className="card">

        <h1 className="title">Get Your Ride 🚗</h1>
        <p className="subtitle">Welcome back, login to continue</p>

        <input className="input mt-6" type="email" placeholder="Email" />
        <input className="input" type="password" placeholder="Password" />

        <button className="btn">Login</button>

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