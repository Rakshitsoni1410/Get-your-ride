import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CaptainSignup() {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const res = await fetch("http://localhost:5000/api/captain/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullname: {
          firstname: form.firstname,
          lastname: form.lastname
        },
        email: form.email,
        password: form.password,
        phone: form.phone,

        vehicle: {
          color: form.vehicleColor,
          plate: form.plate,
          capacity: Number(form.capacity),
          vehicleType: form.vehicleType
        },

        license: {
          number: form.licenseNumber,
          expiry: form.licenseExpiry
        }
      })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/home");
    } else {
      alert(data.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

      <div className="card">

        <h1 className="title">Get Your Ride 🚗</h1>
        <p className="subtitle text-blue-300">Captain Registration</p>

        {/* PERSONAL INFO */}
        <input name="firstname" onChange={handleChange} className="input mt-6" placeholder="First Name" />
        <input name="lastname" onChange={handleChange} className="input" placeholder="Last Name" />
        <input name="email" onChange={handleChange} className="input" placeholder="Email" />
        <input name="password" type="password" onChange={handleChange} className="input" placeholder="Password" />
        <input name="phone" onChange={handleChange} className="input" placeholder="Phone Number" />

        {/* VEHICLE INFO */}
        <input name="vehicleColor" onChange={handleChange} className="input" placeholder="Vehicle Color" />
        <input name="plate" onChange={handleChange} className="input" placeholder="Vehicle Plate Number" />
        <input name="capacity" onChange={handleChange} className="input" placeholder="Capacity (e.g. 4)" />

        <select
          name="vehicleType"
          onChange={handleChange}
          className="input text-black"
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="auto">Auto</option>
        </select>

        {/* LICENSE */}
        <input name="licenseNumber" onChange={handleChange} className="input" placeholder="License Number" />
        <input name="licenseExpiry" type="date" onChange={handleChange} className="input" />

        <button onClick={handleSignup} className="btn">
          Register Captain
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