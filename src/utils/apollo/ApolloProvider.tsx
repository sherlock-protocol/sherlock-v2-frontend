import React from "react"
import { ApolloClient, InMemoryCache, ApolloProvider as Provider } from "@apollo/client"
import { SchemaLink } from "@apollo/client/link/schema"
import { makeExecutableSchema } from "graphql-tools"
import { typeDefs as scalarTypeDefs, resolvers as scalarResolvers } from "graphql-scalars"
import { loader } from "graphql.macro"
import { BigNumber } from "ethers"

const clientSchema = loader("./schema.graphql")
const typeDefs = [clientSchema, scalarTypeDefs]

const positions = [
  {
    id: "0x01",
    owner: "0x0b6a04b8d3d050cbed9a4621a5d503f27743c942",
    usdcAmount: BigNumber.from("1000000").toBigInt(),
    sherAmount: BigNumber.from("1000000000000000000").toBigInt(),
    expiration: BigNumber.from(1644249926818).toBigInt(),
  },
]

const resolvers = {
  ...scalarResolvers,
  Query: {
    positions: (_ctx: any, { owner }: { owner: string }) => positions.filter((p) => p.owner === owner),
  },
}

console.log(typeDefs)

const schema = makeExecutableSchema({ typeDefs, resolvers })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new SchemaLink({ schema }),
})

export const ApolloProvider: React.FC = ({ children }) => <Provider client={client}>{children}</Provider>
