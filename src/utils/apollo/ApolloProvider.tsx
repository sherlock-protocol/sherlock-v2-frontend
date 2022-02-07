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
    id: 1,
    owner: "0x100F04C9B98AB9D22772Aacc469bEA466d54cc4A",
    usdcAmount: BigNumber.from("1000000").toBigInt(),
    sherAmount: BigNumber.from("1000000000000000000").toBigInt(),
    expiration: BigNumber.from(1644249926818).toBigInt(),
  },
  {
    id: 2,
    owner: "0x100F04C9B98AB9D22772Aacc469bEA466d54cc4A",
    usdcAmount: BigNumber.from("1000000").toBigInt(),
    sherAmount: BigNumber.from("1000000000000000000").toBigInt(),
    expiration: BigNumber.from(1644249926818).toBigInt(),
  },
  {
    id: 3,
    owner: "0x100F04C9B98AB9D22772Aacc469bEA466d54cc4A",
    usdcAmount: BigNumber.from("1000000").toBigInt(),
    sherAmount: BigNumber.from("1000000000000000000").toBigInt(),
    expiration: BigNumber.from(1644249926818).toBigInt(),
  },
  {
    id: 1,
    owner: "0x0B6a04b8D3d050cbeD9A4621A5D503F27743c942",
    usdcAmount: BigNumber.from("1000000").toBigInt(),
    sherAmount: BigNumber.from("1000000000000000000").toBigInt(),
    expiration: BigNumber.from(1644249926818).toBigInt(),
  },
  {
    id: 2,
    owner: "0x0B6a04b8D3d050cbeD9A4621A5D503F27743c942",
    usdcAmount: BigNumber.from("1000000").toBigInt(),
    sherAmount: BigNumber.from("1000000000000000000").toBigInt(),
    expiration: BigNumber.from(1644249926818).toBigInt(),
  },
  {
    id: 3,
    owner: "0x0B6a04b8D3d050cbeD9A4621A5D503F27743c942",
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
