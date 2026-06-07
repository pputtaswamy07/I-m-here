import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { LOGIN_USER } from "../graphql/mutations";
import "../styles/join.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginUser] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await loginUser({ variables: formData });
      localStorage.setItem("token", data.login);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── Left brand panel ── */}
      <div className="auth-brand">
        <span className="auth-brand-logo" onClick={() => navigate("/")}>I'm here</span>
        <h1 className="auth-brand-heading">
          Good to have<br />you back.
        </h1>
        <p className="auth-brand-text">
          Your neighborhood still needs you.<br />
          Sign in and pick up where you left off.
        </p>
        <ul className="auth-brand-features">
          <li>See requests near you</li>
          <li>Track your activities</li>
          <li>Stay connected with your community</li>
        </ul>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h2 className="auth-heading">Welcome back</h2>
          <p className="auth-sub">Sign in to continue your journey</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
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

            <div className="field-group">
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

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            New here? <a href="/join">Join the community</a>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;
