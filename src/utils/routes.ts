export const routes = {
  Stake: "stake",
  Positions: "positions",
  Fundraise: "fundraise",
  FundraiseClaim: "fundraiseclaim",
  Protocol: "protocol",
  Overview: "overview",
  USForbidden: "us",
} as const

type R = typeof routes

type ValueOf<T> = T[keyof T]

export type Route = ValueOf<R>
