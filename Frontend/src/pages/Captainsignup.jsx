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
    const res = await fetch("http://localhost:5000/api/user/register", {
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
        password: form.password
      })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-8 rounded-2xl w-[350px] shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">Create Account</h2>

        <input name="firstname" placeholder="First Name" onChange={handleChange} className="input" />
        <input name="lastname" placeholder="Last Name" onChange={handleChange} className="input" />
        <input name="email" placeholder="Email" onChange={handleChange} className="input" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input" />

        <button onClick={handleSignup} className="btn">Signup</button>

        <p className="text-sm text-center mt-4">
          Already have account?{" "}
          <Link to="/" className="font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}