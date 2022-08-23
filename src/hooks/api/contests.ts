import { useQuery } from "react-query"
import { useSignTypedData } from "wagmi"
import { contests as contestsAPI } from "./axios"
import { getContests as getContestsUrl } from "./urls"

export type Contest = {
  id: number
  title: string
  shortDescription: string
  description?: string
  prizePool: number
  startDate: number // Timestamp in seconds.
  endDate: number // Timestamp in seconds.
}

type GetContestsResponseData = {
  id: number
  title: string
  short_description: string
  description: string
  prize_pool: number
  starts_at: number
  ends_at: number
}[]

export const contestsQueryKey = "contests"
export const useContests = () =>
  useQuery<Contest[] | null, Error>(contestsQueryKey, async () => {
    const { data: response } = await contestsAPI.get<GetContestsResponseData>(getContestsUrl())

    return response.map((d) => ({
      id: d.id,
      title: d.title,
      shortDescription: d.short_description,
      description: d.description,
      prizePool: d.prize_pool,
      startDate: d.starts_at,
      endDate: d.ends_at,
    }))
  })

export const useContest = (id: number) => {
  const { data: contests } = useContests()
  contests?.filter((c) => c.id === id)

  return { data: contests && contests.length > 0 ? contests[0] : null }
}

export const useSignContestSignupMessage = (contestId: number) => {
  const domain = {
    name: "Sherlock Contest",
    version: "1",
  }

  const types = {
    Signup: [
      { name: "action", type: "string" },
      { name: "contest_id", type: "uint256" },
    ],
  }

  const value = {
    action: "signup",
    contest_id: contestId,
  }

  return useSignTypedData({ domain, types, value })
}
