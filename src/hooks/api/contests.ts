import { useQuery } from "react-query"
import { contests as contestsAPI } from "./axios"
import { getContests as getContestsUrl } from "./urls"

export type Contest = {
  id: number
  title: string
  prizePool: number
  startDate: number // Timestamp in seconds.
  endDate: number // Timestamp in seconds.
}

type GetContestsResponseData = {
  id: number
  title: string
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
      prizePool: d.prize_pool,
      startDate: d.starts_at,
      endDate: d.ends_at,
    }))
  })

export const contestQueryKey = (id: number) => `contest/${id}`
export const useContest = (id: number) => {
  const { data: contests } = useContests()

  return useQuery<Contest | null, Error>(contestQueryKey(id), async () => {
    contests?.filter((c) => c.id === id)

    return contests && contests.length > 0 ? contests[0] : null
  })
}
