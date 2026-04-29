import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  // 🔥 VALIDATION
  const validateField = (name, value) => {
    let error = "";

    if (name === "firstname" && !value) {
      error = "First name required";
    }

    if (name === "email") {
      if (!value) error = "Email required";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email";
    }

    if (name === "password") {
      if (!value) error = "Password required";
      else if (value.length < 6) error = "Min 6 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleSignup = async () => {
    const hasErrors = Object.values(errors).some((err) => err);

    if (hasErrors) {
      return toast.error("Fix errors first");
    }

    if (!form.firstname || !form.email || !form.password) {
      return toast.error("Fill required fields");
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/register", {
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

        toast.success("Account created 🎉");

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        toast.error(data.message || "Signup failed");
      }

    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

      <div className="card">

        <h1 className="title">Get Your Ride 🚗</h1>
        <p className="subtitle">Create your account</p>

        {/* FIRST NAME */}
        <input
          name="firstname"
          onChange={handleChange}
          className={`input mt-6 ${errors.firstname ? "border-red-500" : ""}`}
          placeholder="First Name"
        />
        {errors.firstname && (
          <p className="text-red-500 text-xs">{errors.firstname}</p>
        )}

        {/* LAST NAME */}
        <input
          name="lastname"
          onChange={handleChange}
          className="input"
          placeholder="Last Name"
        />

        {/* EMAIL */}
        <input
          name="email"
          onChange={handleChange}
          className={`input ${errors.email ? "border-red-500" : ""}`}
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email}</p>
        )}

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          onChange={handleChange}
          className={`input ${errors.password ? "border-red-500" : ""}`}
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}

        <button onClick={handleSignup} className="btn">
          Signup
        </button>

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