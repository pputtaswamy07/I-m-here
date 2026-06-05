import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../../auth/graphql/queries";
import { useNavigate } from "react-router-dom";
import AvailabilityBox from "../../volunteers/components/AvailabilityBox";
import VolunteersList from "../../volunteers/components/VolunteersList";
import ProfileMenu from "../../../shared/components/ProfileMenu";
import "../styles/dashboard.css";


function Dashboard() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_ME);

  if (loading) return <div className="dashboard-container"><div className="loading-state"><div className="spinner"></div></div></div>;
  if (error) return <div className="dashboard-container"><div className="error-state"><h2>Error</h2></div></div>;
  if (!data?.me) return <div className="dashboard-container"><div className="error-state"><h2>User not found</h2></div></div>;

  const user = data.me;

  return (
    <div className="dashboard-wrapper">
      {/* Dashboard Header Navigation */}
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

      {/* Dashboard Content */}
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="welcome-title">Welcome back, <span className="user-name">{user.name}</span> 👋</h1>
        </div>

        <div className="dashboard-content">
          {user.role?.toUpperCase() === "VOLUNTEER" && (
            <section className="dashboard-section volunteer-section">
              <AvailabilityBox />
            </section>
          )}

          {user.role?.toUpperCase() === "SEEKER" && (
            <section className="dashboard-section seeker-section">
              <div className="section-header">
                <h2>Available Volunteers Near You</h2>
              </div>
              <VolunteersList />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;