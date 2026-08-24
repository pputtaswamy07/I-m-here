import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../../auth/graphql/queries";
import PageLayout from "../../../shared/components/PageLayout";
import AvailabilityBox from "../../volunteers/components/AvailabilityBox";
import RequestList from "../../requests/components/RequestList";

function MyActivities() {
  const { data, loading, error } = useQuery(GET_ME);

  if (loading) {
    return (
      <PageLayout>
        <div className="loading-state"><div className="spinner" /></div>
      </PageLayout>
    );
  }

  if (error || !data?.me) {
    return (
      <PageLayout>
        <div className="error-state"><h2>Could not load profile.</h2></div>
      </PageLayout>
    );
  }

  const isVolunteer = data.me.role?.toUpperCase() === "VOLUNTEER";

  return (
    <PageLayout>
      <div className="dashboard-header">
        <h1 className="welcome-title">My <span className="user-name">Activities</span></h1>
      </div>

      <div className="dashboard-content">
        {isVolunteer ? (
          <section className="dashboard-section volunteer-section">
            <AvailabilityBox />
          </section>
        ) : (
          <section className="dashboard-section seeker-section">
            <div className="section-header">
              <h2>Your Request History</h2>
              <p className="section-subtitle">All requests you have posted, open and cancelled.</p>
            </div>
            <RequestList />
          </section>
        )}
      </div>
    </PageLayout>
  );
}

export default MyActivities;
