import { useCallback } from "react"
import { useMutation, useQueryClient } from "react-query"
import { useAccount } from "wagmi"
import { joinContest as joinContestUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { AxiosError } from "axios"
import { FormError } from "../../../utils/Error"
import { contestantQueryKey } from "../contests/useContestant"

type JoinContestResponseData = {
  repo_name: string
}

type JoinContest = {
  repoName: string
  judging: boolean
}

type JoinContestParams = {
  handle: string
  points?: boolean
  judging?: boolean
}

export const useJoinContest = (contestId: number) => {
  const { address: connectedAddress } = useAccount()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...mutation } = useMutation<JoinContest, FormError, JoinContestParams>(
    async (params) => {
      try {
        const { data } = await contestsAPI.post<JoinContestResponseData>(joinContestUrl(), {
          handle: params.handle,
          contest_id: contestId,
          judging: params.judging,
          counts_towards_ranking: params.points,
        })

        return {
          repoName: data.repo_name,
          judging: params.judging ?? false,
        }
      } catch (error) {
        const axiosError = error as AxiosError
        throw new FormError(axiosError.response?.data)
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(contestantQueryKey(connectedAddress ?? "", contestId))
      },
    }
  )

  const reset = useCallback(() => {
    mutation.reset()
  }, [mutation])

  return {
    joinContest: mutate,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    error: mutation.error,
    reset,
  }
}
