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
      handle: string
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

    const contestants = Object.values(data.contestants)
    const contestantsOrderedByScore = contestants.sort((a, b) => a.score - b.score)

    return {
      contestants: contestantsOrderedByScore.map((c) => ({
        handle: c.handle,
        isLeadSenior: c.is_lead_senior,
        isSenior: c.is_senior,
        isTeam: c.is_team,
        score: c.score ?? 0,
        payout: c.payout,
      })),
      totalContestants: data.total_contestants,
    }
  })
