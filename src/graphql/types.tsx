import { gql } from "@apollo/client"
import * as Apollo from "@apollo/client"
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  BigInt: BigInt
  Byte: string
  Currency: any
  DID: any
  Date: any
  DateTime: any
  Duration: any
  EmailAddress: any
  GUID: any
  HSL: any
  HSLA: any
  HexColorCode: any
  Hexadecimal: any
  IBAN: any
  IPv4: any
  IPv6: any
  ISBN: any
  ISO8601Duration: any
  JSON: any
  JSONObject: any
  JWT: any
  Latitude: any
  LocalDate: any
  LocalEndTime: any
  LocalTime: any
  Long: any
  Longitude: any
  MAC: any
  NegativeFloat: any
  NegativeInt: any
  NonEmptyString: any
  NonNegativeFloat: any
  NonNegativeInt: any
  NonPositiveFloat: any
  NonPositiveInt: any
  ObjectID: any
  PhoneNumber: any
  Port: any
  PositiveFloat: any
  PositiveInt: any
  PostalCode: any
  RGB: any
  RGBA: any
  SafeInt: any
  Time: any
  Timestamp: any
  URL: any
  USCurrency: any
  UUID: any
  UnsignedFloat: any
  UnsignedInt: any
  UtcOffset: any
  Void: any
}

export type Position = {
  __typename?: "Position"
  expiration: Scalars["BigInt"]
  id: Scalars["BigInt"]
  owner: Scalars["String"]
  sherAmount: Scalars["BigInt"]
  usdcAmount: Scalars["BigInt"]
}

export type Query = {
  __typename?: "Query"
  positions?: Maybe<Array<Maybe<Position>>>
}

export type QueryPositionsArgs = {
  owner: Scalars["String"]
}

export type GetPositionsQueryVariables = Exact<{
  owner: Scalars["String"]
}>

export type GetPositionsQuery = {
  __typename?: "Query"
  positions?: Array<{
    __typename?: "Position"
    id: BigInt
    usdcAmount: BigInt
    sherAmount: BigInt
    expiration: BigInt
    owner: string
  } | null> | null
}

export const GetPositionsDocument = gql`
  query GetPositions($owner: String!) {
    positions(owner: $owner) {
      id
      usdcAmount
      sherAmount
      expiration
      owner
    }
  }
`

/**
 * __useGetPositionsQuery__
 *
 * To run a query within a React component, call `useGetPositionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPositionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPositionsQuery({
 *   variables: {
 *      owner: // value for 'owner'
 *   },
 * });
 */
export function useGetPositionsQuery(
  baseOptions: Apollo.QueryHookOptions<GetPositionsQuery, GetPositionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetPositionsQuery, GetPositionsQueryVariables>(GetPositionsDocument, options)
}
export function useGetPositionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPositionsQuery, GetPositionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetPositionsQuery, GetPositionsQueryVariables>(GetPositionsDocument, options)
}
export type GetPositionsQueryHookResult = ReturnType<typeof useGetPositionsQuery>
export type GetPositionsLazyQueryHookResult = ReturnType<typeof useGetPositionsLazyQuery>
export type GetPositionsQueryResult = Apollo.QueryResult<GetPositionsQuery, GetPositionsQueryVariables>
