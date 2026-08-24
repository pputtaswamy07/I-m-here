import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
    $phone: String!
    $location: String
    $role: String!
  ) {

    register(
      name: $name
      email: $email
      password: $password
      phone: $phone
      location: $location
      role: $role
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
  mutation MarkAvailable($tasks: [String], $location: String) {
    markAvailable(tasks: $tasks, location: $location) {
      id
    }
  }
`;

export const POST_REQUEST = gql`
  mutation PostRequest(
    $title: String!
    $description: String
    $category: String
    $location: String!
  ) {
    postRequest(
      title: $title
      description: $description
      category: $category
      location: $location
    ) {
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

export const CANCEL_REQUEST = gql`
  mutation CancelRequest($id: ID!) {
    cancelRequest(id: $id) {
      id
      status
    }
  }
`;