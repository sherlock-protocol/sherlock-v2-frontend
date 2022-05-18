export const routes = {
  Stake: "stake",
  Positions: "positions",
  Fundraise: "fundraise",
  FundraiseClaim: "fundraiseclaim",
  Protocols: "protocols",
  Overview: "overview",
  USForbidden: "us",
} as const

export const protocolsRoutes = {
  Balance: "balance",
} as const

type R = typeof routes & typeof protocolsRoutes

type ValueOf<T> = T[keyof T]

export type Route = ValueOf<R>
