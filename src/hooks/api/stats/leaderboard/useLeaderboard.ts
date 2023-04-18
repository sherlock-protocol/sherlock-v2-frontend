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
    handle: string
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

    const entries = Object.values(data)
    const entriesOrderedByScore = entries.sort((a, b) => a.score - b.score)

    console.log(entriesOrderedByScore)

    return entriesOrderedByScore.map((l) => ({
      handle: l.handle,
      isTeam: l.is_team,
      senior: l.senior,
      days: l.days,
      payout: l.payout,
      score: l.score,
    }))
  })
