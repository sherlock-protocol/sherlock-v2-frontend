import { useQuery, UseQueryOptions } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getContestant as getContestantUrl } from "../urls"

type GetContestantResponseData = {
  audit: {
    repo_name: string
    counts_towards_ranking: boolean
    handle: string
    is_team: boolean
  } | null
  judging: {
    repo_name: string
    handle: string
    is_team: boolean
  }
}

type Contestant = {
  audit: {
    repo: string
    countsTowardsRanking: boolean
    handle: string
    isTeam: boolean
  } | null
  judging: {
    repo: string
    handle: string
    isTeam: boolean
  } | null
}

export const contestantQueryKey = (address: string, contestId: number) => ["contestant", address, contestId]
export const useContestant = (address: string, contestId: number, opts?: UseQueryOptions<Contestant | null, Error>) =>
  useQuery<Contestant | null, Error>(
    contestantQueryKey(address, contestId),
    async () => {
      try {
        const { data } = await contestsAPI.get<GetContestantResponseData>(getContestantUrl(address, contestId))

        if (!data) return null

        return {
          audit: data.audit
            ? {
                repo: data.audit.repo_name,
                countsTowardsRanking: data.audit.counts_towards_ranking,
                handle: data.audit.handle,
                isTeam: data.audit.is_team,
              }
            : null,
          judging: data.judging
            ? {
                repo: data.judging.repo_name,
                handle: data.judging.handle,
                isTeam: data.judging.is_team,
              }
            : null,
        }
      } catch (error) {
        return null
      }
    },
    opts
  )
