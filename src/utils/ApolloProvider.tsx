import React from "react"
import { ApolloClient, InMemoryCache, ApolloProvider as Provider } from "@apollo/client"

const client = new ApolloClient({
  uri: "",
  cache: new InMemoryCache(),
})

export const ApolloProvider: React.FC = ({ children }) => <Provider client={client}>{children}</Provider>
