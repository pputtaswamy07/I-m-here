import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../graphql/queries";
import AvailabilityBox from "../components/AvailabilityBox";
import VolunteersList from "../components/VolunteersList";
import "../styles/dashboard.css";

function Dashboard() {
  const { data, loading, error } = useQuery(GET_ME);

  // LOADING
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <h2>⚠️ Something went wrong</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  // NO USER
  if (!data || !data.me) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <h2>User not found</h2>
          <p>Please log in again</p>
        </div>
      </div>
    );
  }

  const user = data.me;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="welcome-title">
          Welcome back, <span className="user-name">{user.name}</span> 👋
        </h1>
        <p className="dashboard-subtitle">
          {user.role === "VOLUNTEER" 
            ? "Manage your availability and help your community" 
            : "Find volunteers near you"}
        </p>
      </div>

      <div className="dashboard-content">
        {/* VOLUNTEER */}
        {user.role === "VOLUNTEER" && (
          <section className="dashboard-section volunteer-section">
            <AvailabilityBox />
          </section>
        )}

        {/* SEEKER */}
        {user.role === "SEEKER" && (
          <section className="dashboard-section seeker-section">
            <div className="section-header">
              <h2>Available Volunteers Near You</h2>
              <p className="section-subtitle">Connect with volunteers ready to help</p>
            </div>
            <VolunteersList />
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;