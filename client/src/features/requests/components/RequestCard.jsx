import { useMutation } from "@apollo/client/react";
import { CANCEL_REQUEST } from "../../auth/graphql/mutations";

const CATEGORY_LABELS = {
  GROCERY:       "Grocery Shopping",
  TRANSPORT:     "Transportation",
  COMPANIONSHIP: "Companionship",
  ERRANDS:       "General Errands",
  OTHER:         "Other",
};

function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function RequestCard({ request }) {
  const [cancelRequest, { loading }] = useMutation(CANCEL_REQUEST, {
    refetchQueries: ["MyRequests"],
  });

  const handleCancel = async () => {
    try {
      await cancelRequest({ variables: { id: request.id } });
    } catch (err) {
      alert(err.message || "Could not cancel request.");
    }
  };

  const isOpen = request.status === "OPEN";

  return (
    <div className={`request-card ${isOpen ? "req-card-open" : "req-card-cancelled"}`}>
      <div className="req-card-header">
        <h3 className="req-card-title">{request.title}</h3>
        <div className="req-badges">
          <span className="req-category-badge">
            {CATEGORY_LABELS[request.category] || request.category}
          </span>
          <span className={`req-status-badge ${isOpen ? "status-open" : "status-cancelled"}`}>
            {isOpen ? "Open" : "Cancelled"}
          </span>
        </div>
      </div>

      {request.description && (
        <p className="req-card-description">{request.description}</p>
      )}

      <div className="req-card-meta">
        <span className="req-meta-item">
          <span className="req-meta-icon">📍</span>
          {request.location}
        </span>
        <span className="req-meta-item">
          <span className="req-meta-icon">🗓</span>
          {formatDate(request.createdAt)}
        </span>
      </div>

      {isOpen && (
        <button
          className="req-cancel-btn"
          onClick={handleCancel}
          disabled={loading}
        >
          {loading ? "Cancelling..." : "Cancel Request"}
        </button>
      )}
    </div>
  );
}

export default RequestCard;
