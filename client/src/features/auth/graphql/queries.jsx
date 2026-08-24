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

// SEEKER — their own posted requests
export const MY_REQUESTS = gql`
  query MyRequests {
    myRequests {
      id
      title
      description
      category
      location
      status
      createdAt
    }
  }
`;

// VOLUNTEER — all open requests they can respond to
export const OPEN_REQUESTS = gql`
  query OpenRequests {
    openRequests {
      id
      title
      description
      category
      location
      status
      createdAt
      seeker {
        name
        location
      }
    }
  }
`;
