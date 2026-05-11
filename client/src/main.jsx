import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from "@apollo/client";
import{ApolloProvider} from "@apollo/client/react"
import { SetContextLink } from "@apollo/client/link/context";
import App from "./App";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

const authLink = new SetContextLink((_, { headers }) => {

  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);