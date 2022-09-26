import { useCallback, useEffect, useMemo } from "react"
import { useMutation } from "react-query"
import { useSignTypedData } from "wagmi"
import { contests as contestsAPI } from "../axios"
import { Auditor } from "../auditors"
import { validateSignature as validateSignatureUrl } from "../urls"

type SignatureVerificationResponseData = {
  auditor: {
    id: number
    handle: string
    github_handle?: string
    discord_handle?: string
  } | null
}

export const useSignUpSignatureVerification = (contestId: number) => {
  const domain = {
    name: "Sherlock Contest",
    version: "1",
  }

  const types = {
    Signup: [
      { name: "action", type: "string" },
      { name: "contest_id", type: "uint256" },
    ],
  }

  const value = {
    action: "participate",
    contest_id: contestId,
  }

  const {
    signTypedData,
    data: signature,
    isLoading: signatureIsLoading,
    error: signatureError,
    reset: resetSignature,
  } = useSignTypedData({ domain, types, value })

  const {
    mutate,
    data,
    isLoading: signatureVerificationIsLoading,
    error: signatureVerificationError,
    reset: resetSignatureVerification,
    isSuccess,
  } = useMutation<Auditor | null, Error, { signature: string }>(async ({ signature }) => {
    const { data } = await contestsAPI.post<SignatureVerificationResponseData>(validateSignatureUrl(), {
      contest_id: contestId,
      signature,
    })

    if (!data.auditor) return null

    return {
      id: data.auditor.id,
      handle: data.auditor.handle,
      githubHandle: data.auditor.github_handle,
      discordHandle: data.auditor.discord_handle,
      addresses: [],
      payoutAddress: "",
    }
  })

  useEffect(() => {
    if (signature) {
      mutate({
        signature,
      })
    }
  }, [signature, mutate])

  const reset = useCallback(() => {
    resetSignature()
    resetSignatureVerification()
  }, [resetSignature, resetSignatureVerification])

  return useMemo(
    () => ({
      verifySignature: signTypedData,
      signature,
      auditor: data,
      isLoading: signatureIsLoading || signatureVerificationIsLoading,
      isSuccess,
      error: signatureError || signatureVerificationError,
      reset,
    }),
    [
      signTypedData,
      signature,
      data,
      signatureIsLoading,
      signatureVerificationIsLoading,
      signatureError,
      signatureVerificationError,
      reset,
      isSuccess,
    ]
  )
}
