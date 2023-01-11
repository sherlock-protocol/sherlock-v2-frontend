import { useMutation, useQueryClient } from "react-query"
import { Address, useAccount, useNetwork, useSignMessage } from "wagmi"
import { SiweMessage } from "siwe"
import { contests as contestsAPI } from "../axios"
import { getAdminNonce as getAdminNonceUrl, adminSignIn as adminSignInUrl } from "../urls"
import { useCallback } from "react"
import { adminProfileQuery } from "./useAdminProfile"
import { AxiosError } from "axios"
import { FormError } from "../../../utils/Error"

type AdminSignInResponse = {
  admin: Address
}

type GetNonceResponseData = {
  nonce: string
}

type AdminSignInParams = {
  signature: string
  message: string
}

export const useAdminSignIn = () => {
  const { address: connectedAddress } = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync, reset: resetSignature, isLoading: signatureIsLoading } = useSignMessage()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...mutation } = useMutation<Address, FormError, AdminSignInParams>(
    async (params) => {
      try {
        const { data } = await contestsAPI.post<AdminSignInResponse>(adminSignInUrl(), {
          signature: params.signature,
          message: params.message,
        })

        return data.admin
      } catch (error) {
        const axiosError = error as AxiosError
        throw new FormError(axiosError.response?.data)
      }
    },
    {
      onSuccess(_data) {
        queryClient.invalidateQueries(adminProfileQuery())
      },
    }
  )

  const signIn = useCallback(async () => {
    if (!connectedAddress) return

    try {
      const { data: nonceResponse } = await contestsAPI.get<GetNonceResponseData>(getAdminNonceUrl())

      if (!nonceResponse.nonce) throw new Error("couldn't get nonce")

      const nonce = nonceResponse.nonce

      const message = new SiweMessage({
        domain: "Sherlock",
        address: connectedAddress,
        statement: "Sign in with Ethereum to Sherlock Audits",
        chainId: chain?.id,
        uri: "https://app.sherlock.xyz",
        version: "1",
        nonce,
      }).prepareMessage()

      const signature = await signMessageAsync({ message })

      mutate({
        signature,
        message,
      })
    } catch (error) {
      console.error(error)
    }
  }, [mutate, connectedAddress, signMessageAsync, chain?.id])

  const reset = useCallback(() => {
    resetSignature()
    mutation.reset()
  }, [resetSignature, mutation])

  return {
    signIn,
    isLoading: signatureIsLoading || mutation.isLoading,
    isError: mutation.isError,
    auditor: mutation.data,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset,
  }
}
