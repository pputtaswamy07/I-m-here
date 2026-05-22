import { useQuery } from "@apollo/client/react";

import { GET_AVAILABILITY } from "../graphql/queries";

import VolunteerCard from "./VolunteerCard";


function VolunteerList() {

  const {
    data,
    loading,
    error
  } = useQuery(GET_AVAILABILITY);


  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error loading volunteers</h2>;
  }


  return (

    <div className="volunteer-list">

      {data.availabilities.map((volunteer) => (

        <VolunteerCard
          key={volunteer.id}
          volunteer={volunteer}
        />
      ))}

    </div>
  );
}

export default VolunteerList;