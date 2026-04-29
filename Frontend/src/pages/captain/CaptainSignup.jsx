import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function CaptainSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    vehicleColor: "",
    plate: "",
    capacity: "",
    vehicleType: "car",
    licenseNumber: "",
    licenseExpiry: ""
  });

  // 🔄 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ VALIDATION (STRICT)
  const validate = () => {
    if (!form.firstname.trim()) {
      toast.error("First name required");
      return false;
    }

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Valid email required");
      return false;
    }

    if (!form.password || form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (!form.phone.trim() || form.phone.length < 10) {
      toast.error("Valid phone number required");
      return false;
    }

    if (!form.vehicleColor.trim() || !form.plate.trim()) {
      toast.error("Vehicle details required");
      return false;
    }

    if (!form.licenseNumber.trim()) {
      toast.error("License number required");
      return false;
    }

    return true;
  };

  // 🚀 SIGNUP
  const handleSignup = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // 🔍 DEBUG
      console.log("FORM DATA:", form);

      const res = await fetch("http://localhost:5000/api/captain/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullname: {
            firstname: form.firstname.trim(),
            lastname: form.lastname.trim()
          },
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),

          vehicle: {
            color: form.vehicleColor.trim(),
            plate: form.plate.trim(),
            capacity: form.capacity ? Number(form.capacity) : 1,
            vehicleType: form.vehicleType
          },

          license: {
            number: form.licenseNumber.trim(),
            expiry: form.licenseExpiry || null
          }
        })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);

        toast.success("Captain registered successfully 🚗");

        setTimeout(() => {
          navigate("/captain/dashboard");
        }, 1500);
      } else {
        toast.error(data.message || "Signup failed");
      }

    } catch (err) {
      console.error("Signup Error:", err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="card">

        <h1 className="title">Get Your Ride 🚗</h1>
        <p className="subtitle text-blue-300">Captain Registration</p>

        {/* PERSONAL */}
        <input name="firstname" onChange={handleChange} className="input mt-6" placeholder="First Name" />
        <input name="lastname" onChange={handleChange} className="input" placeholder="Last Name" />
        <input name="email" onChange={handleChange} className="input" placeholder="Email" />
        <input name="password" type="password" onChange={handleChange} className="input" placeholder="Password" />
        <input name="phone" onChange={handleChange} className="input" placeholder="Phone Number" />

        {/* VEHICLE */}
        <input name="vehicleColor" onChange={handleChange} className="input" placeholder="Vehicle Color" />
        <input name="plate" onChange={handleChange} className="input" placeholder="Vehicle Plate Number" />
        <input name="capacity" onChange={handleChange} className="input" placeholder="Capacity (e.g. 4)" />

        <select name="vehicleType" onChange={handleChange} className="input text-black">
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="auto">Auto</option>
        </select>

        {/* LICENSE */}
        <input name="licenseNumber" onChange={handleChange} className="input" placeholder="License Number" />
        <input name="licenseExpiry" type="date" onChange={handleChange} className="input" />

        <button onClick={handleSignup} className="btn">
          {loading ? "Registering..." : "Register Captain"}
        </button>

        <p className="text-sm text-center mt-5 text-gray-300">
          User?{" "}
          <Link to="/signup" className="text-white font-semibold">
            Signup here
          </Link>
        </p>

      </div>
    </div>
  );
}