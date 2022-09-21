import { useMutation, useQueryClient } from "react-query"
import { AuditorProfile } from "."
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
    payout_address_mainnet: string
  }
}

type UpdateProfileParams = {
  handle?: string
  discordHandle?: string
  githubHandle?: string
  twitterHandle?: string
  telegramHandle?: string
  addresses?: {
    id: number
    address: string
  }[]
  payoutAddress?: string
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  const {
    mutate: update,
    mutateAsync,
    ...mutation
  } = useMutation<AuditorProfile, Error, UpdateProfileParams>(
    async (updates) => {
      const { data } = await contestsAPI.patch<UpdateProfileResponseData>(updateProfileUrl(), {
        payout_address_mainnet: updates.payoutAddress,
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
      }
    },
    {
      onSuccess(data) {
        queryClient.setQueryData("profile", data)
      },
    }
  )

  console.log(mutation)

  return {
    update,
    ...mutation,
  }
}
