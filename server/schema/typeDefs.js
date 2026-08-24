const typeDefs = `#graphql

type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    location: String
    role: String!
}

type Availability {
  id: ID!
  user: User!
  tasks: [String]
  location: String
  isActive: Boolean
  createdAt: String
}

type HelpRequest {
  id: ID!
  seeker: User!
  title: String!
  description: String
  category: String
  location: String!
  status: String!
  createdAt: String
}

type Query {
  availabilities: [Availability]
  me: User
  myRequests: [HelpRequest]
  openRequests: [HelpRequest]
}

type Mutation {
  register(
    name: String!
    email: String!
    password: String!
    phone: String!
    location: String
    role: String!
  ): String

  login(email: String!, password: String!): String

  markAvailable(tasks: [String], location: String): Availability
  markUnavailable: Boolean

  postRequest(
    title: String!
    description: String
    category: String
    location: String!
  ): HelpRequest

  cancelRequest(id: ID!): HelpRequest
}
`;

export default typeDefs;

