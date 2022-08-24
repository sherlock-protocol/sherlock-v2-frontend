import React, { useCallback } from "react"
import { useMutation, useQuery } from "react-query"
import { useSignTypedData } from "wagmi"
import { contests as contestsAPI } from "./axios"
import { getContests as getContestsUrl, validateSignature, contestSignUp as contestSignUpUrl } from "./urls"

export type Contest = {
  id: number
  title: string
  shortDescription: string
  description?: string
  prizePool: number
  startDate: number // Timestamp in seconds.
  endDate: number // Timestamp in seconds.
}

export type Auditor = {
  id: number
  handle: string
  discordHandle?: string
  githubHandle?: string
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

export const useSignatureVerification = (contestId: number) => {
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
    "",
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
    { enabled: !!signature, staleTime: 0 }
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
  signature: string
  contestId: number
}
export const useContestSignUp = (params: SignUpParams) =>
  useMutation(async () => {
    const { data } = await contestsAPI.post(contestSignUpUrl(), {
      handle: params.handle,
      github_handle: params.githubHandle,
      discord_handle: params.discordHandle,
      signature: params.signature,
      contest_id: params.contestId,
    })

    return data
  })
