import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getLeaderboardTimelineContests } from "../urls"

export type ContestLeaderboardTimelineStatus = "FINISHED" | "ESCALATING" | "SHERLOCK_JUDGING"

type ContestLeaderboardTimeline = {
  id: number
  title: string
  logoURL: string
  endDate: number
  status: ContestLeaderboardTimelineStatus
  scoreSequence: number
  completed: boolean
}[]

type GetContestsLeaderboardTimelineResponse = {
  id: number
  title: string
  logo_url: string
  ends_at: number
  status: ContestLeaderboardTimelineStatus
  score_sequence: number
  calc_completed: boolean
}[]

export const leaderboardTimelineContests = () => "leaderboard-timeline"
export const useLeaderboardTimelineContests = () =>
  useQuery<ContestLeaderboardTimeline, Error>(leaderboardTimelineContests(), async () => {
    const { data } = await contestsAPI.get<GetContestsLeaderboardTimelineResponse>(getLeaderboardTimelineContests())

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      logoURL: d.logo_url,
      endDate: d.ends_at,
      status: d.status,
      scoreSequence: d.score_sequence,
      completed: d.calc_completed,
    }))
  })
