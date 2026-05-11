import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { REGISTER_USER } from "../graphql/mutations";
import "../styles/join.css";

function Join() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: ""
  });

  const [registerUser] = useMutation(REGISTER_USER);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await registerUser({
        variables: formData
      });

      localStorage.setItem("token", data.register);
      alert("Registration successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-header">
            <h2>Become a Volunteer</h2>
            <p>Join our community and help your neighbors</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="location"
              placeholder="Your Location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Now"}
          </button>

          <p className="login-link">
            Already registered? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Join;