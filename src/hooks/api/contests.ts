import axios, { AxiosError } from "axios"
import React, { useCallback, useEffect, useMemo } from "react"
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "react-query"
import { useAccount, useSignTypedData } from "wagmi"
import { contests as contestsAPI } from "./axios"
import {
  getContests as getContestsUrl,
  validateSignature,
  contestSignUp as contestSignUpUrl,
  contestOptIn as contestOptInUrl,
  getContestant as getContestantUrl,
} from "./urls"

export type ContestStatus = "CREATED" | "RUNNING" | "JUDGING" | "FINISHED"

export type Contest = {
  id: number
  title: string
  shortDescription: string
  description?: string
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

type GetContestsResponseData = {
  id: number
  title: string
  short_description: string
  description: string
  logo_url: string
  prize_pool: number
  starts_at: number
  ends_at: number
  status: ContestStatus
}[]

function parseErrorName(errorKey: string): string | undefined {
  switch (errorKey) {
    case "handle":
      return "Handle"
    case "github_handle":
      return "Github handle"
    case "discord_handle":
      return "Discord handle"
    case "twitter_handle":
      return "Twitter handle"
    case "telegram_handle":
      return "Telegram handle"
  }
}

export const contestsQueryKey = "contests"
export const useContests = () =>
  useQuery<Contest[] | null, Error>(contestsQueryKey, async () => {
    const { data: response } = await contestsAPI.get<GetContestsResponseData>(getContestsUrl())

    return response.map((d) => ({
      id: d.id,
      title: d.title,
      shortDescription: d.short_description,
      description: d.description,
      logoURL: d.logo_url,
      prizePool: d.prize_pool,
      startDate: d.starts_at,
      endDate: d.ends_at,
      status: d.status,
    }))
  })

export const useContest = (id: number) => {
  const { data: contests } = useContests()
  const filteredContests = contests?.filter((c) => c.id === id)

  return { data: filteredContests && filteredContests.length > 0 ? filteredContests[0] : null }
}

type SignatureVerificationResponseData = {
  auditor: {
    id: number
    handle: string
    github_handle?: string
    discord_handle?: string
  } | null
}

export const useSignatureVerification = (contestId: number, opts?: UseQueryOptions<Auditor | null, Error>) => {
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
    action: "participate",
    contest_id: contestId,
  }

  const { signTypedData, data: signature, isLoading: signatureIsLoading } = useSignTypedData({ domain, types, value })

  const {
    data,
    isLoading: requestIsLoading,
    isFetched,
  } = useQuery<Auditor | null, Error>(
    ["signatureVerification", signature],
    async () => {
      const { data } = await contestsAPI.post<SignatureVerificationResponseData>(validateSignature(), {
        contest_id: contestId,
        signature,
      })

      if (!data.auditor) return null

      return {
        id: data.auditor.id,
        handle: data.auditor.handle,
        githubHandle: data.auditor.github_handle,
        discordHandle: data.auditor.discord_handle,
      }
    },
    { enabled: !!signature, ...opts }
  )

  const signAndVerify = useCallback(async () => {
    try {
      signTypedData()
    } catch (error) {}
  }, [signTypedData])

  return React.useMemo(
    () => ({ signAndVerify, isLoading: signatureIsLoading || requestIsLoading, data, isFetched, signature }),
    [signAndVerify, signatureIsLoading, requestIsLoading, data, isFetched, signature]
  )
}

type SignUpParams = {
  handle: string
  githubHandle: string
  discordHandle: string
  twitterHandle?: string
  telegramHandle?: string
  signature: string
  contestId: number
}
type SignUpResponseData = {
  repo_name: string
}
type SignUp = {
  repo: string
}

export const useContestSignUp = (params: SignUpParams) => {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const {
    mutate: signUp,
    isLoading,
    isSuccess,
    data,
    error,
    isError,
    reset,
  } = useMutation<SignUp | null, Error>(
    async () => {
      try {
        const { data } = await contestsAPI.post<SignUpResponseData>(contestSignUpUrl(), {
          handle: params.handle,
          github_handle: params.githubHandle,
          discord_handle: params.discordHandle.trim(),
          twitter_handle: params.twitterHandle?.trim(),
          telegram_handle: params.telegramHandle?.trim(),
          signature: params.signature,
          contest_id: params.contestId,
          address,
        })

        return {
          repo: data.repo_name,
        }
      } catch (error) {
        const axiosError = error as AxiosError

        let errorMessage = ""
        if (!axiosError.response?.data) {
          errorMessage = "Unkwnown error"
        } else if (axiosError.response.data["error"]) {
          errorMessage = axiosError.response.data["error"]
        } else {
          const errors = Object.entries(axiosError.response.data).map(([k, v]) => `${parseErrorName(k)}: ${v}`)
          errorMessage = errors.join("\n")
        }

        throw Error(errorMessage)
      }
    },
    {
      onSettled(data, error, variables, context) {
        queryClient.invalidateQueries(contestantQueryKey(address ?? "", params.contestId))
      },
    }
  )

  return useMemo(
    () => ({ signUp, isLoading, isSuccess, data, error, isError, reset }),
    [isLoading, isSuccess, data, error, isError, signUp, reset]
  )
}

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
