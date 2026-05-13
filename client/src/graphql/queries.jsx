import { gql } from "@apollo/client";

export const GET_AVAILABILITY = gql`
  query GetAvailabilities {
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