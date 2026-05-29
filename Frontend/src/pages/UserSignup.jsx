import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Car, Eye, EyeOff } from "lucide-react";

export default function UserSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (name, value) => {
    let error = "";
    if (name === "firstname" && !value.trim()) error = "First name required";
    if (name === "email") {
      if (!value) error = "Email required";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email format";
    }
    if (name === "password") {
      if (!value) error = "Password required";
      else if (value.length < 6) error = "At least 6 characters";
    }
    setErrors((p) => ({ ...p, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value);
  };

  const handleSignup = async () => {
    // Validate all
    ["firstname", "email", "password"].forEach((f) => validate(f, form[f]));
    if (!form.firstname || !form.email || !form.password) return toast.error("Fill all required fields");
    if (Object.values(errors).some((e) => e)) return toast.error("Fix errors first");

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: { firstname: form.firstname, lastname: form.lastname },
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "user");
        if (data.user) localStorage.setItem("userId", data.user._id);
        toast.success("Account created! 🎉");
        setTimeout(() => navigate("/home"), 800);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, type = "text", placeholder, extra }) => (
    <div>
      <div className="relative">
        <input
          name={name}
          type={type === "password" ? (showPwd ? "text" : "password") : type}
          onChange={handleChange}
          placeholder={placeholder}
          className={`input ${errors[name] ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
        />
        {type === "password" && (
          <button onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition">
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errors[name] && <p className="text-red-400 text-xs mt-1 ml-1">{errors[name]}</p>}
      {extra}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 py-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F5C518]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="card relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#F5C518] rounded-xl flex items-center justify-center">
            <Car size={20} className="text-black" />
          </div>
          <div>
            <p className="title text-xl leading-none">GetYourRide</p>
            <p className="subtitle text-xs">Fast · Safe · Comfortable</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Create account</h1>
        <p className="text-[#666] text-sm mb-6">Join thousands of happy riders</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input name="firstname" onChange={handleChange} placeholder="First name *" className={`input !mt-0 ${errors.firstname ? "border-red-500" : ""}`} />
            {errors.firstname && <p className="text-red-400 text-xs mt-1">{errors.firstname}</p>}
          </div>
          <input name="lastname" onChange={handleChange} placeholder="Last name" className="input !mt-0" />
        </div>

        <Field name="email" type="email" placeholder="Email address *" />
        <Field name="password" type="password" placeholder="Password (min 6 chars) *" />

        <button onClick={handleSignup} className="btn" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-sm text-center mt-6 text-[#666]">
          Already have an account?{" "}
          <Link to="/" className="text-[#F5C518] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
