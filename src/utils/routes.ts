export const routes = {
  Stake: "stake",
  Positions: "positions",
  Fundraise: "fundraise",
  Claim: "claim",
  Protocols: "protocols",
  AuditContests: "audits",
  ProtocolDashboard: "dashboard/:dashboardID",
  Admin: "admin",
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
  Leaderboard: "leaderboard",
  Profile: "profile",
} as const

export const adminRoutes = {
  InternalOverview: "overview",
  Contests: "contests",
  Scope: "scope",
} as const

export const protocolDashboardRoutes = {
  Payments: "payments",
  InitialPayment: "initial_payment",
  Team: "team",
  Scope: "scope",
} as const

type R = typeof routes &
  typeof protocolsRoutes &
  typeof contestsRoutes &
  typeof adminRoutes &
  typeof protocolDashboardRoutes

type ValueOf<T> = T[keyof T]

export type Route = ValueOf<R>
