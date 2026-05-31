
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Car, Eye, EyeOff } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function UserSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: {
              firstname: form.firstname,
              lastname: form.lastname,
            },
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "user");

        if (data.user?._id) {
          localStorage.setItem("userId", data.user._id);
        }

        toast.success("Account created successfully 🎉");

        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    name,
    type = "text",
    placeholder,
  }) => (
    <div className="mb-4">
      <div className="relative">
        <input
          name={name}
          value={form[name]}
          type={
            type === "password"
              ? showPwd
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          onChange={handleChange}
          className={`input ${
            errors[name]
              ? "border-red-500 focus:border-red-500"
              : ""
          }`}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPwd ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {errors[name] && (
        <p className="text-red-400 text-xs mt-1">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px]"
        style={{
          background: "var(--glow)",
          opacity: 0.4,
        }}
      />

      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <div className="card relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "var(--accent)",
            }}
          >
            <Car
              size={20}
              style={{
                color: "var(--accent-text)",
              }}
            />
          </div>

          <div>
            <h1
              className="text-xl font-bold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              GetYourRide
            </h1>

            <p
              className="text-xs"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Fast • Safe • Comfortable
            </p>
          </div>
        </div>

        <h2
          className="text-2xl font-bold mb-2"
          style={{
            color: "var(--text-primary)",
          }}
        >
          Create Account
        </h2>

        <p
          className="mb-6"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Join thousands of happy riders
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                placeholder="First Name *"
                className={`input ${
                  errors.firstname
                    ? "border-red-500"
                    : ""
                }`}
              />

              {errors.firstname && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.firstname}
                </p>
              )}
            </div>

            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              className="input"
            />
          </div>

          <Field
            name="email"
            type="email"
            placeholder="Email Address *"
          />

          <Field
            name="password"
            type="password"
            placeholder="Password *"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn w-full mt-4"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p
          className="text-center mt-6 text-sm"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold hover:underline"
            style={{
              color: "var(--accent)",
            }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
