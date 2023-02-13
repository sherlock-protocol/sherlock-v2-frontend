import { Contest } from "../hooks/api/contests"

export const getTotalRewards = (contest: Contest): number =>
  contest.prizePool + contest.leadSeniorAuditorFixedPay + (contest.judgingPrizePool ?? 0)
