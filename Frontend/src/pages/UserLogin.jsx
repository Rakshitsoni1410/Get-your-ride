import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Enter email and password");
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.token)
        return toast.error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "captain") {
        localStorage.setItem("captainToken", data.token);
        localStorage.setItem("captainId", data.captain._id);
        toast.success("Welcome back, Captain! 🚗");
        setTimeout(() => navigate("/captain/dashboard"), 800);
      } else {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userId", data.user._id);
        toast.success("Welcome back! 👋");
        setTimeout(() => navigate("/home"), 800);
      }
    } catch {
      toast.error("Server error. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F5C518]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="card relative z-10">
        {/* ── LOGO ── */}
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/logo.png"
            alt="GetYourRide Logo"
            className="h-12 w-12 object-contain rounded-xl"
          />
          <div>
            <p
              className="text-xl font-extrabold leading-none"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              GetYourRide
            </p>
            <p className="text-xs text-[#888] mt-0.5">
              Fast · Safe · Comfortable
            </p>
          </div>
        </div>

        <h1
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Sign in
        </h1>
        <p className="text-[#666] text-sm mb-6">
          Enter your credentials to continue
        </p>

        <input
          className="input"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <div className="relative mt-3">
          <input
            className="input !mt-0 pr-12"
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition"
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button onClick={handleLogin} className="btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="mt-6 pt-6 border-t border-[#1e1e1e] space-y-3">
          <p className="text-sm text-center text-[#666]">
            No account?{" "}
            <Link
              to="/signup"
              className="text-[#F5C518] font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
          <p className="text-sm text-center text-[#666]">
            Are you a driver?{" "}
            <Link
              to="/captain/signup"
              className="text-[#F5C518] font-semibold hover:underline"
            >
              Join as Captain
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
