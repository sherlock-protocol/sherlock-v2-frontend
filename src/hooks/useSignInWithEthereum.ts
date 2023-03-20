import { useCallback, useEffect, useMemo, useState } from "react"
import { useAccount, useNetwork, useSignMessage } from "wagmi"
import { SiweMessage } from "siwe"
import { contests as contestsAPI } from "./api/axios"
import { getNonce as getNonceUrl } from "./api/urls"
import { useMutation, useQueryClient } from "react-query"
import { AuditorProfile } from "./api/auditors/index"
import { GetAuditorProfile, profileQuery } from "./api/auditors/useProfile"
import { ethers } from "ethers"

type GetNonceResponseData = {
  nonce: string
}

export const useSignInWithEthereum = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [signature, setSignature] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()

  const { signMessageAsync } = useSignMessage()
  const queryClient = useQueryClient()
  const { mutate: verify, isLoading: verificationIsLoading } = useMutation<
    AuditorProfile,
    Error,
    { message: string; signature: string }
  >(
    async ({ signature, message }) => {
      const { data } = await contestsAPI.post<GetAuditorProfile>("/verify", {
        message,
        signature,
      })

      if (!data.profile) throw new Error("missing profile")

      return {
        id: data.profile.id,
        handle: data.profile.handle,
        githubHandle: data.profile.github_handle,
        discordHandle: data.profile.discord_handle,
        addresses: data.profile.addresses.map((a) => ({ id: a.id, address: a.address })),
        payoutAddress: data.profile.payout_address_mainnet,
        managedTeams: data.profile.managed_teams.map((t) => ({ id: t.id, handle: t.handle })),
        auditDays: data.profile.days,
      }
    },
    {
      onSuccess(data) {
        queryClient.setQueryData(profileQuery(), data)
      },
    }
  )

  useEffect(() => {
    setSignature(undefined)
  }, [address])

  const signIn = useCallback(async () => {
    if (!address || !chain) return

    setIsLoading(true)
    setError(undefined)
    try {
      const { data: nonceResponse } = await contestsAPI.get<GetNonceResponseData>(getNonceUrl())

      if (!nonceResponse.nonce) throw new Error("couldn't get nonce")

      const nonce = nonceResponse.nonce

      const message = new SiweMessage({
        domain: "app.sherlock.xyz",
        address: ethers.utils.getAddress(address),
        statement: "Sign in with Ethereum to Sherlock Audits",
        chainId: chain?.id,
        uri: "https://app.sherlock.xyz",
        version: "1",
        nonce,
      }).prepareMessage()

      const signature = await signMessageAsync({ message })

      verify({ message, signature })

      setSignature(signature)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }, [signMessageAsync, setIsLoading, address, chain, verify])

  return useMemo(
    () => ({ signIn, isLoading: isLoading || verificationIsLoading, error, isError: !!error, signature }),
    [signIn, isLoading, error, signature, verificationIsLoading]
  )
}
