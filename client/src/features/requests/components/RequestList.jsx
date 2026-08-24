import { useQuery } from "@apollo/client/react";
import { MY_REQUESTS } from "../../auth/graphql/queries";
import RequestCard from "./RequestCard";

function RequestList() {
  const { data, loading, error } = useQuery(MY_REQUESTS);

  if (loading) return <div className="req-list-status">Loading your requests...</div>;
  if (error)   return <div className="req-list-status req-list-error">Could not load requests.</div>;

  const requests = data?.myRequests ?? [];

  if (requests.length === 0) {
    return (
      <div className="req-list-empty">
        <p>You haven't posted any requests yet.</p>
        <p className="req-list-empty-hint">Use the form above to let volunteers know how they can help.</p>
      </div>
    );
  }

  return (
    <div className="request-list">
      {requests.map((req) => (
        <RequestCard key={req.id} request={req} />
      ))}
    </div>
  );
}

export default RequestList;
