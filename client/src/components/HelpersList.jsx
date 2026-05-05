import { useQuery } from "@apollo/client/react";
import { GET_AVAILABILITY } from "../graphql/queries";

function HelpersList() {
  const { loading, error, data } = useQuery(GET_AVAILABILITY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading helpers</p>;

  return (
    <div>
      <h2>Available Helpers</h2>

      {data.availabilities.map((a) => (
        <div key={a.id}>
          <h3>{a.user.name}</h3>
          <p>{a.location}</p>
          <p>{a.tasks.join(", ")}</p>
          <p>{a.user.phone}</p>
        </div>
      ))}
    </div>
  );
}

export default HelpersList;