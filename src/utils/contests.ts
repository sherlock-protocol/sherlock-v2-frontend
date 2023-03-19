import { DateTime } from "luxon"
import { Contest } from "../hooks/api/contests"

export const getTotalRewards = (contest: Contest): number =>
  contest.prizePool + contest.leadSeniorAuditorFixedPay + (contest.judgingPrizePool ?? 0)

export const startDateIsTBD = (contest: Pick<Contest, "startDate">): boolean =>
  DateTime.fromSeconds(contest.startDate).year === 2030
