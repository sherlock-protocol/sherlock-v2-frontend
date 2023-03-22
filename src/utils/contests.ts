import { DateTime } from "luxon"
import { Contest } from "../hooks/api/contests"

export const startDateIsTBD = (contest: Pick<Contest, "startDate">): boolean =>
  DateTime.fromSeconds(contest.startDate).year === 2030
