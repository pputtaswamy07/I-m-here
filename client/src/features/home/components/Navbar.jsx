import "../styles/navbar.css";
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../../auth/graphql/queries";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const { data } = useQuery(GET_ME, { skip: !token });
  const user = data?.me;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

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

          <div className="profile-avatar" onClick={() => setOpen(!open)}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {open && user && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-avatar-large">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <p>📍 {user.location}</p>
              </div>

              <hr />

              <button onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button>Notifications</button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
