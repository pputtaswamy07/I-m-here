import { gql } from "@apollo/client";

export const MARK_AVAILABLE = gql`
  mutation($tasks: [String], $location: String) {
    markAvailable(tasks: $tasks, location: $location) {
      id
    }
  }
`;