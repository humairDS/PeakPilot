import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await registerUser(formData);

      localStorage.setItem("token", res.data?.access_token || res.access_token);

      alert("Registration successful");
      navigate("/");
    } catch (err) {
      console.error("Register failed:", err);
      alert(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="mb-6 opacity-80">Start your PeakPilot journey</p>

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              type="text"
              name="first_name"
              className="input w-full"
              placeholder="First name"
              value={formData.first_name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="last_name"
              className="input w-full"
              placeholder="Last name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="username"
            className="input mb-4 w-full"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            className="input mb-4 w-full"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            className="input mb-6 w-full"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm opacity-80 text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;