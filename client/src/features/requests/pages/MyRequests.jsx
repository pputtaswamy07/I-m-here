import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../../auth/graphql/queries";
import PageLayout from "../../../shared/components/PageLayout";
import RequestForm from "../components/RequestForm";
import RequestList from "../components/RequestList";
import OpenRequestsList from "../components/OpenRequestsList";

function MyRequests() {
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

  const isSeeker = data.me.role?.toUpperCase() === "SEEKER";

  return (
    <PageLayout>
      <div className="dashboard-header">
        <h1 className="welcome-title">
          {isSeeker ? "My " : "Open "}
          <span className="user-name">Requests</span>
        </h1>
      </div>

      <div className="dashboard-content">
        <section className="dashboard-section seeker-section">
          {isSeeker ? (
            <>
              <RequestForm />
              <h3 className="req-list-section-title">Your Requests</h3>
              <RequestList />
            </>
          ) : (
            <>
              <div className="section-header">
                <h2>Seekers Near You</h2>
                <p className="section-subtitle">People in your community who need help right now.</p>
              </div>
              <OpenRequestsList />
            </>
          )}
        </section>
      </div>
    </PageLayout>
  );
}

export default MyRequests;
