import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function UserSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname: {
          firstname: form.firstname,
          lastname: form.lastname
        },
        email: form.email,
        password: form.password
      })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/home");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

      <div className="card">

        <h1 className="title">Get Your Ride 🚗</h1>
        <p className="subtitle">Create your account</p>

        <input name="firstname" onChange={handleChange} className="input mt-6" placeholder="First Name" />
        <input name="lastname" onChange={handleChange} className="input" placeholder="Last Name" />
        <input name="email" onChange={handleChange} className="input" placeholder="Email" />
        <input name="password" onChange={handleChange} className="input" placeholder="Password" type="password" />

        <button onClick={handleSignup} className="btn">Signup</button>

        <p className="text-sm text-center mt-5 text-gray-300">
          Already have account?{" "}
          <Link to="/" className="text-white font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}