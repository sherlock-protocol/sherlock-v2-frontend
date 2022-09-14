import { useCallback, useEffect, useMemo, useState } from "react"
import { useAccount, useNetwork, useSignMessage } from "wagmi"
import { SiweMessage } from "siwe"
import { contests as contestsAPI } from "./api/axios"
import { getNonce as getNonceUrl } from "./api/urls"

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
        domain: "Sherlock",
        address,
        statement: "Sign in with Ethereum to Sherlock Audits",
        chainId: chain?.id,
        uri: "https://app.sherlock.xyz",
        version: "1",
        nonce,
      }).prepareMessage()

      const signature = await signMessageAsync({ message })

      await contestsAPI.post("/verify", {
        message,
        signature,
      })

      setSignature(signature)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }, [signMessageAsync, setIsLoading, address, chain])

  return useMemo(
    () => ({ signIn, isLoading, error, isError: !!error, signature }),
    [signIn, isLoading, error, signature]
  )
}
