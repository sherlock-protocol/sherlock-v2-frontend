import { useQuery } from "react-query"
import { contests as contestsAPI } from "./axios"
import { getIsAuditor as getIsAuditorUrl, getAuditorProfile as getProfileUrl } from "./urls"

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
}

export type AuditorProfile = Auditor & {}

type GetIsAuditorResponseData = {
  is_auditor: boolean
}

type GetAuditorProfile = {
  profile: {
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
  }
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
  useQuery<AuditorProfile, Error>(profileQuery(), async () => {
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
    }
  })
