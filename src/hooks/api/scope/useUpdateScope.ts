import { useMutation, useQueryClient } from "react-query"
import { AxiosError } from "axios"
import { contests as contestsAPI } from "../axios"
import { updateScope as updateScopeUrl } from "../urls"
import { scopeQueryKey } from "./useScope"

type UpdateScopeParams = {
  protocolDashboardID: string
  repoName: string
  commitHash?: string
  branchName?: string
  files?: string[]
}

export const useUpdateScope = () => {
  const queryClient = useQueryClient()
  const {
    mutate: updateScope,
    mutateAsync,
    ...mutation
  } = useMutation<void, Error, UpdateScopeParams>(
    async (params) => {
      try {
        await contestsAPI.put(updateScopeUrl(params.protocolDashboardID, params.repoName), {
          commit_hash: params.commitHash,
          branch_name: params.branchName,
          files: params.files,
        })
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }
    },
    {
      onSuccess(data, params) {
        queryClient.invalidateQueries(scopeQueryKey(params.protocolDashboardID))
      },
    }
  )

  return {
    updateScope,
    ...mutation,
  }
}
