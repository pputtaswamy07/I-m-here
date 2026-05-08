import { useQuery } from "@apollo/client/react";
import VolunteerCard from "./VolunteerCard";
import { GET_AVAILABILITY } from "../graphql/queries";
import "../styles/volunteersection.css";

function VolunteersSection() {
  const { loading, error, data } = useQuery(GET_AVAILABILITY);

  if (loading) return <p>Loading volunteers...</p>;

  if (error) return <p>Error loading volunteers</p>;

  return (
    <section className="volunteers-section">
      <h2>Currently Available Volunteers Near You</h2>

      <div className="volunteers-grid">
        {data.availabilities.map((volunteer) => (
          <VolunteerCard
            key={volunteer.id}
            volunteer={volunteer}
          />
        ))}
      </div>
    </section>
  );
}

export default VolunteersSection;