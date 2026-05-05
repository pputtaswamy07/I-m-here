import { gql } from "@apollo/client";

export const GET_AVAILABILITY = gql`
  query {
    availabilities {
      id
      location
      tasks
      user {
        name
        phone
      }
    }
  }
`;