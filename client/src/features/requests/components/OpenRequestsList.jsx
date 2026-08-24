import { useQuery } from "@apollo/client/react";
import { OPEN_REQUESTS } from "../../auth/graphql/queries";

const CATEGORY_LABELS = {
  GROCERY:       "Grocery Shopping",
  TRANSPORT:     "Transportation",
  COMPANIONSHIP: "Companionship",
  ERRANDS:       "General Errands",
  OTHER:         "Other",
};

function OpenRequestsList() {
  const { data, loading, error } = useQuery(OPEN_REQUESTS);

  if (loading) return <div className="req-list-status">Loading open requests...</div>;
  if (error)   return <div className="req-list-status req-list-error">Could not load requests.</div>;

  const requests = data?.openRequests ?? [];

  if (requests.length === 0) {
    return (
      <div className="req-list-empty">
        <p>No open requests right now.</p>
        <p className="req-list-empty-hint">Check back soon — seekers in your area will post here when they need help.</p>
      </div>
    );
  }

  return (
    <div className="request-list">
      {requests.map((req) => (
        <div key={req.id} className="request-card req-card-open">
          <div className="req-card-header">
            <h3 className="req-card-title">{req.title}</h3>
            <span className="req-category-badge">
              {CATEGORY_LABELS[req.category] || req.category}
            </span>
          </div>

          {req.description && (
            <p className="req-card-description">{req.description}</p>
          )}

          <div className="req-card-meta">
            <span className="req-meta-item">
              <span className="req-meta-icon">📍</span>
              {req.location}
            </span>
            {req.seeker?.name && (
              <span className="req-meta-item">
                <span className="req-meta-icon">👤</span>
                Posted by {req.seeker.name}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OpenRequestsList;
