import { useCallback, useEffect, useMemo, useState } from "react"
import { useAccount, useNetwork, useSignMessage } from "wagmi"
import { SiweMessage } from "siwe"
import { contests as contestsAPI } from "./api/axios"
import { authenticateAuditor as authenticateAuditorUrl } from "./api/urls"
import { Auditor } from "./api/auditors"

type AuthenticateAuditorResponseData = {
  auditor: {
    id: number
    handle: string
    github_handle?: string
    discord_handle?: string
    telegram_handle?: string
    twitter_handle?: string
  } | null
}

export const useSignInWithEthereum = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [isLoading, setIsLoading] = useState(false)
  const [auditor, setAuditor] = useState<Auditor>()

  const message = useMemo(
    () =>
      address &&
      new SiweMessage({
        domain: "Sherlock",
        address,
        statement: "Sign in with Ethereum to Sherlock Audits",
        chainId: chain?.id,
        uri: "https://app.sherlock.xyz",
        version: "1",
      }).prepareMessage(),
    [chain, address]
  )

  const { signMessageAsync } = useSignMessage({ message })

  useEffect(() => {
    setAuditor(undefined)
  }, [address])

  const signIn = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    try {
      const signature = await signMessageAsync()

      const { data: response } = await contestsAPI.post<AuthenticateAuditorResponseData>(
        authenticateAuditorUrl(address),
        {
          signature,
        }
      )

      if (response.auditor) {
        setAuditor({
          id: response.auditor.id,
          handle: response.auditor.handle,
          githubHandle: response.auditor.github_handle,
          discordHandle: response.auditor.discord_handle,
          telegramHandle: response.auditor.telegram_handle,
          twitterHandle: response.auditor.twitter_handle,
        })
      } else {
        setAuditor(undefined)
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }, [signMessageAsync, setIsLoading, setAuditor, address])

  return useMemo(() => ({ signIn, isLoading, auditor }), [signIn, isLoading, auditor])
}
