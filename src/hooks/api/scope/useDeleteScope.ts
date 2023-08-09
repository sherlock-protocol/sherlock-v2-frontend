import { useMutation, useQueryClient } from "react-query"
import { AxiosError } from "axios"
import { contests as contestsAPI } from "../axios"
import { Scope, scopeQueryKey } from "./useScope"
import { deleteScope as deleteScopeUrl } from "../urls"
import { protocolDashboardQuery } from "../contests/useProtocolDashboard"

type DeleteScopeParams = {
  protocolDashboardID: string
  repoName: string
}

type DeleteScopeContext = {
  previousScope?: Scope
}

export const useDeleteScope = () => {
  const queryClient = useQueryClient()

  const {
    mutate: deleteScope,
    mutateAsync,
    ...mutation
  } = useMutation<void, Error, DeleteScopeParams, DeleteScopeContext>(
    async (params) => {
      try {
        await contestsAPI.delete(deleteScopeUrl(params.protocolDashboardID, params.repoName))
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }
    },
    {
      onMutate: async (params) => {
        await queryClient.invalidateQueries(scopeQueryKey(params.protocolDashboardID))

        const previousScope = queryClient.getQueryData<Scope>(scopeQueryKey(params.protocolDashboardID))

        queryClient.setQueryData<Scope[] | undefined>(scopeQueryKey(params.protocolDashboardID), (previous) =>
          previous?.filter((s) => s.repoName !== params.repoName)
        )

        return { previousScope }
      },
      onError(err, params, context) {
        queryClient.setQueryData(scopeQueryKey(params.protocolDashboardID), context?.previousScope)
      },
      onSettled(data, error, params) {
        queryClient.invalidateQueries(scopeQueryKey(params.protocolDashboardID))
        queryClient.invalidateQueries(protocolDashboardQuery(params.protocolDashboardID))
      },
    }
  )

  return {
    deleteScope,
    ...mutation,
  }
}
