import React from "react"
import { ApolloClient, InMemoryCache, ApolloProvider as Provider } from "@apollo/client"
import { SchemaLink } from "@apollo/client/link/schema"
import { makeExecutableSchema } from "graphql-tools"
import { loader } from "graphql.macro"

const typeDefs = loader("./schema.graphql")

const positions = [
  {
    id: "0x01",
    owner: "0x0b6a04b8d3d050cbed9a4621a5d503f27743c942",
    usdcAmount: 1000,
    sherAmount: 100,
    expiration: 1644249926818,
  },
  {
    id: "0x02",
    owner: "0x0b6a04b8d3d050cbed9a4621a5d503f27743c942",
    usdcAmount: 1000,
    sherAmount: 100,
    expiration: 1644249926818,
  },
  {
    id: "0x03",
    owner: "0x0b6a04b8d3d050cbed9a4621a5d503f27743c942",
    usdcAmount: 1000,
    sherAmount: 100,
    expiration: 1644249926818,
  },
  {
    id: "0x04",
    owner: "0x100f04c9b98ab9d22772aacc469bea466d54cc4a",
    usdcAmount: 1000,
    sherAmount: 100,
    expiration: 1644249926818,
  },
  {
    id: "0x05",
    owner: "0x100f04c9b98ab9d22772aacc469bea466d54cc4a",
    usdcAmount: 1000,
    sherAmount: 100,
    expiration: 1644249926818,
  },
  {
    id: "0x06",
    owner: "0x100f04c9b98ab9d22772aacc469bea466d54cc4a",
    usdcAmount: 1000,
    sherAmount: 100,
    expiration: 1644249926818,
  },
]

const resolvers = {
  Query: {
    positions: (owner: string) => positions.filter((p) => p.owner === owner),
  },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new SchemaLink({ schema }),
})

export const ApolloProvider: React.FC = ({ children }) => <Provider client={client}>{children}</Provider>
