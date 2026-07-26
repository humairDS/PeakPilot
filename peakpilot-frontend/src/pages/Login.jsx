import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);

  useEffect(() => {
    const sessionExpiredMessage = sessionStorage.getItem("sessionExpiredMessage");

    if (sessionExpiredMessage) {
      setInfoMsg(sessionExpiredMessage);
      sessionStorage.removeItem("sessionExpiredMessage");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      setLoading(true);

      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.access_token);

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMsg(err?.response?.data?.error || "Login failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p>Log in to continue your PeakPilot journey.</p>

        {infoMsg && <div className="inline-alert success" style={{ marginTop: "20px" }}>{infoMsg}</div>}
        {errorMsg && <div className="inline-alert error" style={{ marginTop: "20px" }}>{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
