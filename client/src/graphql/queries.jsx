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

// GET CURRENT LOGGED-IN USER
export const GET_ME = gql`

  query {

    me {
      id
      name
      email
      role
      location
    }
  }
`;
