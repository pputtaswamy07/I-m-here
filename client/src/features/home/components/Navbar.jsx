import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import ProfileMenu from "../../../shared/components/ProfileMenu";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <nav className="navbar">
      <div className="home-brand" onClick={() => navigate("/")}>
        I'm here
      </div>

      {!token ? (
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/contact">contact</Link>
          <Link to="/join" className="nav-join">Join</Link>
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
