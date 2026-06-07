import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { REGISTER_USER } from "../graphql/mutations";
import "../styles/join.css";
import LocationAutocomplete from "../../location/components/LocationAutocomplete";
import "../../location/styles/location.css";

function Join() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    role: "VOLUNTEER"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [registerUser] = useMutation(REGISTER_USER);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await registerUser({ variables: formData });
      localStorage.setItem("token", data.register);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── Left brand panel (gold) ── */}
      <div className="auth-brand auth-brand--gold">
        <span className="auth-brand-logo" onClick={() => navigate("/")}>I'm here</span>
        <h1 className="auth-brand-heading">
          Join a kinder<br />neighborhood.
        </h1>
        <p className="auth-brand-text">
          Thousands of people in your area are ready<br />
          to give and receive a little help.
        </p>
        <ul className="auth-brand-features">
          <li>Volunteer your time for local seniors</li>
          <li>Request help with everyday tasks</li>
          <li>Build real connections nearby</li>
          <li>Free to join, always</li>
        </ul>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h2 className="auth-heading">Create account</h2>
          <p className="auth-sub">Join our community and help your neighbors</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Jane Smith"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label>I want to</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="VOLUNTEER">Volunteer — offer help</option>
                <option value="SEEKER">Seeker — request help</option>
              </select>
            </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label>Location</label>
              <LocationAutocomplete
                value={formData.location}
                onChange={(location) => setFormData({ ...formData, location })}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Joining..." : "Join Now"}
            </button>
          </form>

          <p className="auth-switch">
            Already a member? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Join;
