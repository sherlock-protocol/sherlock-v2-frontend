import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "react-query"
import { AuditorProfile } from "."
import { FormError } from "../../../utils/Error"
import { contests as contestsAPI } from "../axios"
import { updateProfile as updateProfileUrl } from "../urls"

type UpdateProfileResponseData = {
  profile: {
    id: number
    handle: string
    github_handle: string
    discord_handle?: string
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
}

type UpdateProfileParams = {
  discordHandle?: string
  githubHandle?: string
  twitterHandle?: string
  telegramHandle?: string
  addresses?: string[]
  payoutAddress?: string
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  const {
    mutate: update,
    mutateAsync,
    ...mutation
  } = useMutation<AuditorProfile, FormError, UpdateProfileParams>(
    async (updates) => {
      try {
        const { data } = await contestsAPI.patch<UpdateProfileResponseData>(updateProfileUrl(), {
          github_handle: updates.githubHandle,
          discord_handle: updates.discordHandle,
          twitter_handle: updates.twitterHandle === "" ? null : updates.twitterHandle,
          telegram_handle: updates.telegramHandle === "" ? null : updates.telegramHandle,
          payout_address_mainnet: updates.payoutAddress,
          addresses: updates.addresses,
        })

        return {
          id: data.profile.id,
          handle: data.profile.handle,
          githubHandle: data.profile.github_handle,
          discordHandle: data.profile.discord_handle,
          twitterHandle: data.profile.twitter_handle,
          telegramHandle: data.profile.telegram_handle,
          addresses: data.profile.addresses.map((a) => ({ id: a.id, address: a.address })),
          payoutAddress: data.profile.payout_address_mainnet,
          managedTeams: data.profile.managed_teams.map((t) => ({ id: t.id, handle: t.handle })),
        }
      } catch (error) {
        const axiosError = error as AxiosError
        throw new FormError(axiosError.response?.data)
      }
    },
    {
      onSuccess(data) {
        queryClient.setQueryData("profile", data)
      },
    }
  )

  return {
    update,
    ...mutation,
  }
}
