import { useQuery } from "react-query"
import { AuditorProfile } from "./index"
import { contests as contestsAPI } from "../axios"
import { getAuditorProfile as getProfileUrl } from "../urls"

export type AuditorResponseData = {
  id: number
  handle: string
  discord_handle?: string
  github_handle: string
  twitter_handle?: string
  telegram_handle?: string
  frozen: boolean
  unfreeze_deposit: number
  addresses: {
    id: number
    address: string
  }[]
  managed_teams: {
    id: number
    handle: string
  }[]
  payout_address_mainnet: string
  days: number
}

export type GetAuditorProfile = {
  profile: AuditorResponseData
}

export const parseAuditorResponse = (data: AuditorResponseData): AuditorProfile => ({
  id: data.id,
  handle: data.handle,
  discordHandle: data.discord_handle,
  githubHandle: data.github_handle,
  twitterHandle: data.twitter_handle,
  telegramHandle: data.telegram_handle,
  addresses: data.addresses.map((a) => ({
    id: a.id,
    address: a.address,
  })),
  managedTeams: data.managed_teams.map((t) => ({
    id: t.id,
    handle: t.handle,
  })),
  payoutAddress: data.payout_address_mainnet,
  auditDays: data.days,
  frozen: data.frozen,
  unfreezeDeposit: data.unfreeze_deposit,
})

export const profileQuery = () => "profile"
export const useProfile = () =>
  useQuery<AuditorProfile, Error>(
    profileQuery(),
    async () => {
      const { data } = await contestsAPI.get<GetAuditorProfile>(getProfileUrl())
      return parseAuditorResponse(data.profile)
    },
    {
      retry: false,
    }
  )
