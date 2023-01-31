import { useMutation, useQueryClient } from "react-query"
import { AxiosError } from "axios"
import { contests as contestsAPI } from "../axios"
import { scopeQueryKey } from "./useScope"
import { deleteScope as deleteScopeUrl } from "../urls"

type DeleteScopeParams = {
  protocolDashboardID: string
  repoName: string
}

export const useDeleteScope = () => {
  const queryClient = useQueryClient()

  const {
    mutate: deleteScope,
    mutateAsync,
    ...mutation
  } = useMutation<void, Error, DeleteScopeParams>(
    async (params) => {
      try {
        await contestsAPI.delete(deleteScopeUrl(params.protocolDashboardID, params.repoName))
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
    deleteScope,
    ...mutation,
  }
}
