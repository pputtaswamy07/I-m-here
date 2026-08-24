import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import "../../features/dashboard/styles/dashboard.css";

function PageLayout({ children }) {
  const navigate = useNavigate();
  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-left">
            <h3 className="nav-brand" onClick={() => navigate("/")}>I'm here</h3>
          </div>
          <div className="nav-right">
            <ProfileMenu />
          </div>
        </div>
      </header>
      <div className="dashboard-container">
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
