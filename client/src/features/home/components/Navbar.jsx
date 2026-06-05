import "../styles/navbar.css";
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import ProfileMenu from "../../../shared/components/ProfileMenu";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <nav className="navbar">
      <div className="logo-section" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logo" />
        <h2>I'm Here</h2>
      </div>

      {!token ? (
        <div className="nav-links">
          <Link to="/join">Join</Link>
          <Link to="/login">Login</Link>
        </div>
      ) : (
        <div className="profile-wrapper">
          <button className="notification-btn">🔔</button>
          <ProfileMenu showDashboard />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
