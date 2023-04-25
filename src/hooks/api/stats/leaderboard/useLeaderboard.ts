import { useQuery } from "react-query"
import { contests as contestsAPI } from "../../axios"
import { getLeaderboard } from "../../urls"

export type Leaderboard = {
  handle: string
  senior: boolean
  isTeam: boolean
  score: number
  days: number
  payout: number
}[]

type GetLeaderboardResponseData = Record<
  string,
  {
    is_team: boolean
    senior: boolean
    score: number
    days: number
    payout: number
  }
>

export const leaderboardKey = () => "leaderboard"
export const useLeaderboard = () =>
  useQuery<Leaderboard>(leaderboardKey(), async () => {
    const { data } = await contestsAPI.get<GetLeaderboardResponseData>(getLeaderboard())

    const entriesOrderedByScore = Object.entries(data).sort(
      (a, b) => b[1].score - a[1].score || b[1].payout - a[1].payout
    )

    return entriesOrderedByScore.map((l) => ({
      handle: l[0],
      isTeam: l[1].is_team,
      senior: l[1].senior,
      days: l[1].days,
      payout: l[1].payout,
      score: l[1].score,
    }))
  })
