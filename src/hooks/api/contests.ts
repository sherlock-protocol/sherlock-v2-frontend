import { useCallback, useEffect, useMemo } from "react"
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "react-query"
import { useAccount, useSignTypedData } from "wagmi"
import { contests as contestsAPI } from "./axios"
import {
  getContests as getContestsUrl,
  getContest as getContestUrl,
  contestOptIn as contestOptInUrl,
  getContestant as getContestantUrl,
  getScoreboard as getScoreboardUrl,
} from "./urls"

export type ContestStatus = "CREATED" | "RUNNING" | "JUDGING" | "FINISHED"

export type Contest = {
  id: number
  title: string
  shortDescription: string
  description?: string
  report?: string
  logoURL?: string
  prizePool: number
  startDate: number // Timestamp in seconds.
  endDate: number // Timestamp in seconds.
  status: ContestStatus
}

export type Auditor = {
  id: number
  handle: string
  discordHandle?: string
  githubHandle?: string
  twitterHandle?: string
  telegramHandle?: string
}

export type Contestant = {
  repo: string
  countsTowardsRanking: boolean
}

export type Scoreboard = {
  handle: string
  score: number
}[]

type GetContestsResponseData = {
  id: number
  title: string
  short_description: string
  logo_url: string
  prize_pool: number
  starts_at: number
  ends_at: number
  status: ContestStatus
}[]

export const contestsQueryKey = "contests"
export const useContests = () =>
  useQuery<Contest[], Error>(contestsQueryKey, async () => {
    const { data: response } = await contestsAPI.get<GetContestsResponseData>(getContestsUrl())

    return response.map((d) => ({
      id: d.id,
      title: d.title,
      shortDescription: d.short_description,
      logoURL: d.logo_url,
      prizePool: d.prize_pool,
      startDate: d.starts_at,
      endDate: d.ends_at,
      status: d.status,
    }))
  })

type GetContestResponseData = {
  id: number
  title: string
  short_description: string
  logo_url: string
  prize_pool: number
  starts_at: number
  ends_at: number
  status: ContestStatus
  description?: string
  report?: string
}

export const contestQueryKey = (id: number) => ["contest", id]
export const useContest = (id: number) =>
  useQuery<Contest, Error>(contestQueryKey(id), async () => {
    const { data: response } = await contestsAPI.get<GetContestResponseData>(getContestUrl(id))

    return {
      id: response.id,
      title: response.title,
      shortDescription: response.short_description,
      logoURL: response.logo_url,
      prizePool: response.prize_pool,
      startDate: response.starts_at,
      endDate: response.ends_at,
      status: response.status,
      description: response.description,
      report: response.report,
    }
  })

type GetContestantResponseData = {
  contestant: {
    repo_name: string
    counts_towards_ranking: boolean
  } | null
}
export const contestantQueryKey = (address: string, contestId: number) => ["contestant", address, contestId]
export const useContestant = (address: string, contestId: number, opts?: UseQueryOptions<Contestant | null, Error>) =>
  useQuery<Contestant | null, Error>(
    contestantQueryKey(address, contestId),
    async () => {
      try {
        const { data } = await contestsAPI.get<GetContestantResponseData>(getContestantUrl(address, contestId))

        if (data.contestant === null) return null

        const { contestant } = data

        return {
          repo: contestant.repo_name,
          countsTowardsRanking: contestant.counts_towards_ranking,
        }
      } catch (error) {
        return null
      }
    },
    opts
  )

export const useOptInOut = (contestId: number, optIn: boolean) => {
  const domain = {
    name: "Sherlock Contest",
    version: "1",
  }

  const types = {
    RankingOptIn: [
      { name: "contest_id", type: "uint256" },
      { name: "opt_in", type: "bool" },
    ],
  }

  const value = {
    opt_in: optIn,
    contest_id: contestId,
  }

  const { signTypedData, data: signature, isLoading: signatureIsLoading } = useSignTypedData({ domain, types, value })
  const { address } = useAccount()
  const queryClient = useQueryClient()

  const { isLoading: mutationIsLoading, mutateAsync: doOptIn } = useMutation(async () => {
    await contestsAPI.post(contestOptInUrl(), {
      contest_id: contestId,
      opt_in: optIn,
      signature,
    })
  })

  useEffect(() => {
    const optInOut = async () => {
      if (signature) {
        await doOptIn()
        await queryClient.invalidateQueries(contestantQueryKey(address ?? "", contestId))
      }
    }
    optInOut()
  }, [signature, doOptIn, address, contestId, queryClient])

  const signAndOptIn = useCallback(() => {
    signTypedData()
  }, [signTypedData])

  return useMemo(
    () => ({ isLoading: mutationIsLoading || signatureIsLoading, signAndOptIn }),
    [mutationIsLoading, signatureIsLoading, signAndOptIn]
  )
}

type GetScoreboardResponseData = {
  handle: string
  score: number
}[]

export const scoreboardQueryKey = () => "scoreboard"
export const useScoreboard = () =>
  useQuery<Scoreboard, Error>(scoreboardQueryKey(), async () => {
    const { data } = await contestsAPI.get<GetScoreboardResponseData>(getScoreboardUrl())

    return data.map((d) => ({
      handle: d.handle,
      score: d.score,
    }))
  })
