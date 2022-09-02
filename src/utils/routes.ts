export const routes = {
  Stake: "stake",
  Positions: "positions",
  Fundraise: "fundraise",
  Claim: "claim",
  Protocols: "protocols",
  AuditContests: "audits",
  Internal: "internal",
  Overview: "overview",
  USForbidden: "us",
} as const

export const protocolsRoutes = {
  Balance: "balance",
  Claims: "claims",
} as const

export const contestsRoutes = {
  Contests: "contests",
  ContestDetails: "contests/:contestId",
} as const

export const internalRoutes = {
  InternalOverview: "overview",
} as const

type R = typeof routes & typeof protocolsRoutes & typeof contestsRoutes & typeof internalRoutes

type ValueOf<T> = T[keyof T]

export type Route = ValueOf<R>
