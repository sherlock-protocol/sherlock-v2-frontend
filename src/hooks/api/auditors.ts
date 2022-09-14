import { useMemo, useCallback } from "react"
import { useQuery, UseQueryOptions } from "react-query"
import { useSignTypedData } from "wagmi"
import { contests as contestsAPI } from "./axios"
import {
  getIsAuditor as getIsAuditorUrl,
  getAuditorProfile as getProfileUrl,
  validateSignature as validateSignatureUrl,
} from "./urls"

export type Auditor = {
  id: number
  handle: string
  discordHandle?: string
  githubHandle?: string
  twitterHandle?: string
  telegramHandle?: string
  addresses: {
    id: number
    address: string
  }[]
  payoutAddress: string
}

export type AuditorProfile = Auditor & {}

type GetIsAuditorResponseData = {
  is_auditor: boolean
}

type AuditorResponseData = {
  id: number
  handle: string
  discord_handle?: string
  github_handle?: string
  twitter_handle?: string
  telegram_handle?: string
  addresses: {
    id: number
    address: string
  }[]
  payout_address_mainnet: string
}

type GetAuditorProfile = {
  profile: AuditorResponseData
}

type SignatureVerificationResponseData = {
  auditor: AuditorResponseData | null
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
      const { data } = await contestsAPI.post<SignatureVerificationResponseData>(validateSignatureUrl(), {
        contest_id: contestId,
        signature,
      })

      if (!data.auditor) return null

      return {
        id: data.auditor.id,
        handle: data.auditor.handle,
        githubHandle: data.auditor.github_handle,
        discordHandle: data.auditor.discord_handle,
        addresses: [],
        payoutAddress: data.auditor.payout_address_mainnet,
      }
    },
    { enabled: !!signature, ...opts }
  )

  const signAndVerify = useCallback(async () => {
    try {
      signTypedData()
    } catch (error) {}
  }, [signTypedData])

  return useMemo(
    () => ({ signAndVerify, isLoading: signatureIsLoading || requestIsLoading, data, isFetched, signature }),
    [signAndVerify, signatureIsLoading, requestIsLoading, data, isFetched, signature]
  )
}

export const isAuditorQuery = (address?: string) => ["isAuditor", address]
export const useIsAuditor = (address?: string) =>
  useQuery<boolean, Error>(
    isAuditorQuery(address),
    async () => {
      const { data } = await contestsAPI.get<GetIsAuditorResponseData>(getIsAuditorUrl(address ?? ""))

      return data.is_auditor
    },
    { enabled: address !== undefined }
  )

export const profileQuery = () => "profile"
export const useProfile = () =>
  useQuery<AuditorProfile, Error>(
    profileQuery(),
    async () => {
      const { data } = await contestsAPI.get<GetAuditorProfile>(getProfileUrl())

      return {
        id: data.profile.id,
        handle: data.profile.handle,
        discordHandle: data.profile.discord_handle,
        githubHandle: data.profile.github_handle,
        twitterHandle: data.profile.twitter_handle,
        telegramHandle: data.profile.telegram_handle,
        addresses: data.profile.addresses.map((a) => ({
          id: a.id,
          address: a.address,
        })),
        payoutAddress: data.profile.payout_address_mainnet,
      }
    },
    {
      retry: false,
    }
  )
