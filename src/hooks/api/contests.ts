import React, { useCallback } from "react"
import { useMutation, useQuery, UseQueryOptions } from "react-query"
import { useSignTypedData } from "wagmi"
import { contests as contestsAPI } from "./axios"
import {
  getContests as getContestsUrl,
  validateSignature,
  contestSignUp as contestSignUpUrl,
  getContestant as getContestantUrl,
} from "./urls"

export type Contest = {
  id: number
  title: string
  shortDescription: string
  description?: string
  logoURL?: string
  prizePool: number
  startDate: number // Timestamp in seconds.
  endDate: number // Timestamp in seconds.
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
      logoURL: d.logo_url,
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
    action: "participate",
    contest_id: contestId,
  }

  return useSignTypedData({ domain, types, value })
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
  githubHandle?: string
  discordHandle?: string
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
export const useContestSignUp = (params: SignUpParams) =>
  useMutation<SignUp | null, Error>(async () => {
    const { data } = await contestsAPI.post<SignUpResponseData>(contestSignUpUrl(), {
      handle: params.handle,
      github_handle: params.githubHandle,
      discord_handle: params.discordHandle,
      twitter_handle: params.twitterHandle,
      telegram_handle: params.telegramHandle,
      signature: params.signature,
      contest_id: params.contestId,
    })

    return {
      repo: data.repo_name,
    }
  })

type GetContestantResponseData = {
  contestant: {
    repo_name: string
  } | null
}
export const contestantQueryKey = (address: string, contestId: number) => `contestant-${address}-${contestId}`
export const useContestant = (address: string, contestId: number, opts?: UseQueryOptions<Contestant | null, Error>) =>
  useQuery<Contestant | null, Error>(
    contestantQueryKey(address, contestId),
    async () => {
      const { data } = await contestsAPI.get<GetContestantResponseData>(getContestantUrl(address, contestId))

      if (data.contestant === null) return null

      const { contestant } = data

      return {
        repo: contestant.repo_name,
      }
    },
    opts
  )
