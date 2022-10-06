import { AxiosError } from "axios"
import { useCallback } from "react"
import { useMutation } from "react-query"
import { useAccount } from "wagmi"
import { AuditorProfile } from "."
import { FormError } from "../../../utils/Error"
import { contests as contestsAPI } from "../axios"
import { signUp as signUpUrl } from "../urls"
import { useSignSignUpMessage } from "./useSignSignUpMessage"

type SignUpResponseData = {
  auditor: {
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

type SignUpParams = {
  handle: string
  githubHandle: string
  discordHandle: string
  twitterHandle?: string
  telegramHandle?: string
  address: string
  signature: string
}

export const useSignUp = () => {
  const { address: connectedAddress } = useAccount()
  const { signTypedDataAsync, isLoading: signatureIsLoading } = useSignSignUpMessage()

  const { mutate, mutateAsync, ...mutation } = useMutation<AuditorProfile, FormError, SignUpParams>(async (params) => {
    try {
      const { data } = await contestsAPI.post<SignUpResponseData>(signUpUrl(), {
        handle: params.handle,
        github_handle: params.githubHandle,
        discord_handle: params.discordHandle,
        twitter_handle: params.twitterHandle && params.twitterHandle.length > 0 ? params.twitterHandle : undefined,
        telegram_handle: params.telegramHandle && params.telegramHandle.length > 0 ? params.telegramHandle : undefined,
        signature: params.signature,
        address: params.address,
      })

      return {
        id: data.auditor.id,
        handle: data.auditor.handle,
        githubHandle: data.auditor.github_handle,
        discordHandle: data.auditor.discord_handle,
        twitterHandle: data.auditor.twitter_handle,
        telegramHandle: data.auditor.telegram_handle,
        addresses: data.auditor.addresses.map((a) => ({ id: a.id, address: a.address })),
        payoutAddress: data.auditor.payout_address_mainnet,
      }
    } catch (error) {
      console.log(error)
      const axiosError = error as AxiosError
      throw new FormError(axiosError.response?.data)
    }
  })

  const signUp = useCallback(
    async (params: Omit<SignUpParams, "address" | "signature">) => {
      if (!connectedAddress) return

      try {
        const signature = await signTypedDataAsync()

        console.log(signature)

        mutate({
          ...params,
          signature,
          address: connectedAddress,
        })
      } catch (error) {
        console.error(error)
      }
    },
    [signTypedDataAsync, mutate, connectedAddress]
  )

  return {
    signUp,
    isLoading: signatureIsLoading || mutation.isLoading,
    auditor: mutation.data,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}
