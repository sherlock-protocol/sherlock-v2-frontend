export const routes = {
  Stake: "stake",
  Positions: "positions",
  Fundraise: "fundraise",
  FundraiseClaim: "fundraiseclaim",
  Protocols: "protocols",
  Internal: "internal",
  Overview: "overview",
  USForbidden: "us",
} as const

export const protocolsRoutes = {
  Balance: "balance",
  Claims: "claims",
} as const

export const internalRoutes = {
  InternalOverview: "overview",
} as const

type R = typeof routes & typeof protocolsRoutes & typeof internalRoutes

type ValueOf<T> = T[keyof T]

export type Route = ValueOf<R>
