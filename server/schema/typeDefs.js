const typeDefs = `#graphql

type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
}

type Availability {
id: ID!
user: User!
tasks: [String]
location: String
isActive: Boolean
createdAt: String
}

type Query {
    availabilities: [Availability]
     me: User
}

type Mutation {
register(name: String!, email: String!, password: String!): String
login(email: String!, password: String!): String

markAvailable(tasks: [String], location: String): Availability
markUnavailable: Boolean
}
`;

export default typeDefs;

