import { useQuery } from "react-query"
import { AuditorProfile } from "./index"
import { contests as contestsAPI } from "../axios"
import { getAuditorProfile as getProfileUrl } from "../urls"

type AuditorResponseData = {
  id: number
  handle: string
  discord_handle?: string
  github_handle: string
  twitter_handle?: string
  telegram_handle?: string
  addresses: {
    id: number
    address: string
  }[]
  managed_teams: {
    id: number
    handle: string
  }[]
  payout_address_mainnet: string
}

export type GetAuditorProfile = {
  profile: AuditorResponseData
}

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
        managedTeams: data.profile.managed_teams.map((t) => ({
          id: t.id,
          handle: t.handle,
        })),
        payoutAddress: data.profile.payout_address_mainnet,
      }
    },
    {
      retry: false,
    }
  )
