import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Car, ChevronDown } from "lucide-react";

export default function CaptainSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    firstname: "", lastname: "", email: "", password: "", phone: "",
    vehicleColor: "", plate: "", capacity: "4", vehicleType: "car",
    licenseNumber: "", licenseExpiry: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validateStep1 = () => {
    if (!form.firstname.trim()) { toast.error("First name required"); return false; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error("Valid email required"); return false; }
    if (form.password.length < 6) { toast.error("Password min 6 chars"); return false; }
    if (form.phone.length < 10) { toast.error("Valid phone required"); return false; }
    return true;
  };

  const handleSignup = async () => {
    if (!form.vehicleColor || !form.plate) { toast.error("Vehicle details required"); return; }
    if (!form.licenseNumber) { toast.error("License number required"); return; }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/captain/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: { firstname: form.firstname.trim(), lastname: form.lastname.trim() },
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          vehicle: {
            color: form.vehicleColor.trim(),
            plate: form.plate.trim(),
            capacity: Number(form.capacity) || 4,
            vehicleType: form.vehicleType,
          },
          license: { number: form.licenseNumber.trim(), expiry: form.licenseExpiry || null },
        }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "captain");
        localStorage.setItem("captainToken", data.token);
        localStorage.setItem("captainId", data.captain._id);
        toast.success("Welcome aboard, Captain! 🚗");
        setTimeout(() => navigate("/captain/dashboard"), 800);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "input";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="card relative z-10 max-w-sm w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Car size={20} className="text-white" />
          </div>
          <div>
            <p className="title text-xl leading-none">GetYourRide</p>
            <p className="text-blue-400 text-xs font-semibold">Captain Registration</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-[#F5C518]" : "bg-[#222]"}`} />
          ))}
        </div>

        {step === 1 ? (
          <>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Personal Info</h2>
            <p className="text-[#555] text-sm mb-4">Step 1 of 2 · About you</p>

            <div className="grid grid-cols-2 gap-3">
              <input name="firstname" onChange={handleChange} placeholder="First name *" className="input !mt-0" />
              <input name="lastname" onChange={handleChange} placeholder="Last name" className="input !mt-0" />
            </div>
            <input name="email" type="email" onChange={handleChange} placeholder="Email *" className={inputClass} />
            <input name="password" type="password" onChange={handleChange} placeholder="Password (min 6) *" className={inputClass} />
            <input name="phone" type="tel" onChange={handleChange} placeholder="Phone number *" className={inputClass} />

            <button onClick={() => { if (validateStep1()) setStep(2); }} className="btn">
              Continue →
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Vehicle Info</h2>
            <p className="text-[#555] text-sm mb-4">Step 2 of 2 · Your vehicle</p>

            <div className="grid grid-cols-2 gap-3">
              <input name="vehicleColor" onChange={handleChange} placeholder="Color *" className="input !mt-0" />
              <input name="plate" onChange={handleChange} placeholder="Plate No. *" className="input !mt-0" />
            </div>
            <input name="capacity" onChange={handleChange} defaultValue="4" placeholder="Seating capacity" className={inputClass} />

            <div className="relative">
              <select name="vehicleType" onChange={handleChange} className="input appearance-none pr-10 cursor-pointer">
                <option value="car">🚗 Car</option>
                <option value="bike">🏍️ Bike</option>
                <option value="auto">🛺 Auto</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none mt-1.5" />
            </div>

            <input name="licenseNumber" onChange={handleChange} placeholder="License number *" className={inputClass} />
            <div className="mt-3">
              <p className="text-xs text-[#555] mb-1 ml-1">License expiry date</p>
              <input name="licenseExpiry" type="date" onChange={handleChange} className="input !mt-0" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => setStep(1)} className="btn-ghost !mt-0">← Back</button>
              <button onClick={handleSignup} disabled={loading} className="btn !mt-0 !w-auto">
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </>
        )}

        <p className="text-sm text-center mt-5 text-[#666]">
          Already registered?{" "}
          <Link to="/" className="text-[#F5C518] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
