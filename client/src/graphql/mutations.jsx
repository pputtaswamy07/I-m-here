import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
    $phone: String!
    $location: String
  ) {

    register(
      name: $name
      email: $email
      password: $password
      phone: $phone
      location: $location
    )
  }
`;

export const LOGIN_USER = gql`
  mutation Login(
    $email: String!
    $password: String!
  ) {

    login(
      email: $email
      password: $password
    )
  }
`;

export const MARK_AVAILABLE = gql`
  mutation MarkAvailable(
    $tasks: [String]
    $location: String
  ) {

    markAvailable(
      tasks: $tasks
      location: $location
    ) {
      id
    }
  }
`;