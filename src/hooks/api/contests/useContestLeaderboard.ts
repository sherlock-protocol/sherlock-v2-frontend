import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getContestLeaderboard as getContestLeaderboardUrl } from "../urls"

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
  contestants: {
    handle: string
    is_lead_senior: boolean
    is_senior: boolean
    is_team: boolean
    score: number
    payout: number
  }[]
  total_contestants: number
}

export const contestLeaderboardQuery = (id: number) => `contest-${id}-leaderboard`
export const useContestLeaderboard = (contestID: number) =>
  useQuery<ContestLeaderboard, Error>(contestLeaderboardQuery(contestID), async () => {
    const { data } = await contestsAPI.get<GetContestLeaderboardResponse>(getContestLeaderboardUrl(contestID))

    return {
      contestants: data.contestants.map((c) => ({
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
