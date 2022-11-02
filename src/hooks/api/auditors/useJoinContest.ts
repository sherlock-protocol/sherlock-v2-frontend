import { useCallback } from "react"
import { useMutation, useQueryClient } from "react-query"
import { useAccount } from "wagmi"
import { useSignJoinContestMessage } from "./useSignJoinContestMessage"
import { joinContest as joinContestUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { contestantQueryKey } from "../contests"

type JoinContestResponseData = {
  repo_name: string
}

type JoinContest = {
  repoName: string
}

type JoinContestParams = {
  signature: string
  handle: string
}

export const useJoinContest = (contestId: number) => {
  const { address: connectedAddress } = useAccount()
  const queryClient = useQueryClient()

  const {
    signTypedDataAsync,
    isLoading: signatureIsLoading,
    reset: resetSignature,
  } = useSignJoinContestMessage(contestId)

  const { mutate, mutateAsync, ...mutation } = useMutation<JoinContest, Error, JoinContestParams>(
    async (params) => {
      const { data } = await contestsAPI.post<JoinContestResponseData>(joinContestUrl(), {
        handle: params.handle,
        signature: params.signature,
        contest_id: contestId,
        address: connectedAddress,
      })

      return {
        repoName: data.repo_name,
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(contestantQueryKey(connectedAddress ?? "", contestId))
      },
    }
  )

  const joinContest = useCallback(
    async (handle: string) => {
      if (!connectedAddress) return

      try {
        const signature = await signTypedDataAsync()

        mutate({
          signature,
          handle,
        })
      } catch (error) {
        console.error(error)
      }
    },
    [signTypedDataAsync, mutate, connectedAddress]
  )

  const reset = useCallback(() => {
    resetSignature()
    mutation.reset()
  }, [mutation, resetSignature])

  return {
    joinContest,
    isLoading: signatureIsLoading || mutation.isLoading,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    error: mutation.error,
    reset,
  }
}
