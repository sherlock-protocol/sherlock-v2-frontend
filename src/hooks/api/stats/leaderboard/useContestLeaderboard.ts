import { useQuery } from "react-query"
import { contests as contestsAPI } from "../../axios"
import { getContestLeaderboard } from "../../urls"

type ContestLeaderboard = {
  contestants: {
    handle: string
    isLeadSenior: boolean
    isSenior: boolean
    isTeam: boolean
    score: number
    payout: number
  }[]
  totalContestants: number
}

type GetContestLeaderboardResponse = {
  contestants: Record<
    string,
    {
      is_lead_senior: boolean
      is_senior: boolean
      is_team: boolean
      score: number
      payout: number
    }
  >
  total_contestants: number
}

export const contestLeaderboardQuery = (id: number) => `contest-${id}-leaderboard`
export const useContestLeaderboard = (contestID: number) =>
  useQuery<ContestLeaderboard, Error>(contestLeaderboardQuery(contestID), async () => {
    const { data } = await contestsAPI.get<GetContestLeaderboardResponse>(getContestLeaderboard(contestID))

    const contestantsOrderedByScore = Object.entries(data.contestants).sort(
      (a, b) => Math.round(b[1].score) - Math.round(a[1].score) || b[1].payout - a[1].payout
    )

    return {
      contestants: contestantsOrderedByScore.map((c) => ({
        handle: c[0],
        isLeadSenior: c[1].is_lead_senior,
        isSenior: c[1].is_senior,
        isTeam: c[1].is_team,
        score: c[1].score ?? 0,
        payout: c[1].payout,
      })),
      totalContestants: data.total_contestants,
    }
  })
