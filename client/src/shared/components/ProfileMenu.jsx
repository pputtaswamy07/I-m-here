import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client/react";
import "../styles/profileMenu.css";

function ProfileMenu({ showDashboard = false }) {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    localStorage.clear();
    await client.clearStore();
    navigate("/login");
  };

  const go = (path) => { setOpen(false); navigate(path); };

  return (
    <div className="pm-wrapper" ref={ref}>
      <button
        className="pm-avatar"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open profile menu"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" fill="#6b7280" />
          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="pm-dropdown">
          {showDashboard && (
            <button className="pm-item" onClick={() => go("/dashboard")}>Dashboard</button>
          )}
          <button className="pm-item" onClick={() => go("/my-requests")}>Requests</button>
          <button className="pm-item" onClick={() => go("/my-activities")}>My Activities</button>
          <button className="pm-item" onClick={() => go("/settings")}>Settings</button>
          <button className="pm-item" onClick={() => go("/contact")}>Contact</button>
          <div className="pm-divider" />
          <button className="pm-item pm-item--danger" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
