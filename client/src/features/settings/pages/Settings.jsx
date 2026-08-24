import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../../auth/graphql/queries";
import PageLayout from "../../../shared/components/PageLayout";
import "./settings.css";

const ROLE_LABELS = { VOLUNTEER: "Volunteer", SEEKER: "Seeker" };

function Field({ label, value }) {
  return (
    <div className="settings-field">
      <span className="settings-label">{label}</span>
      <span className="settings-value">{value || "—"}</span>
    </div>
  );
}

function Settings() {
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

  const user = data.me;

  return (
    <PageLayout>
      <div className="dashboard-header">
        <h1 className="welcome-title">
          Account <span className="user-name">Settings</span>
        </h1>
      </div>

      <div className="dashboard-content">
        <section className="dashboard-section settings-section">
          <div className="section-header">
            <h2>Your Profile</h2>
            <p className="section-subtitle">Your account information as registered.</p>
          </div>

          <div className="settings-card">
            <Field label="Name"     value={user.name} />
            <Field label="Email"    value={user.email} />
            <Field label="Location" value={user.location} />
            <Field label="Role"     value={ROLE_LABELS[user.role] || user.role} />
          </div>

          <p className="settings-coming-soon">
            Profile editing is coming soon. For changes, please contact us.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}

export default Settings;
