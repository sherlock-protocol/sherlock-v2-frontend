import { useMutation, useQueryClient } from "react-query"
import { AxiosError } from "axios"
import { contests as contestsAPI } from "../axios"
import { addScope as addScopeUrl } from "../urls"
import { scopeQueryKey } from "./useScope"
import { protocolDashboardQuery } from "../contests/useProtocolDashboard"

type AddScopeParams = {
  protocolDashboardID: string
  repoName: string
}

export const useAddScope = () => {
  const queryClient = useQueryClient()

  const {
    mutate: addScope,
    mutateAsync,
    ...mutation
  } = useMutation<void, Error, AddScopeParams>(
    async (params) => {
      try {
        const repo_name = params.repoName.startsWith("https://github.com/")
          ? params.repoName.replace("https://github.com/", "")
          : params.repoName
        await contestsAPI.post(addScopeUrl(params.protocolDashboardID), {
          repo_name,
        })
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }
    },
    {
      onSuccess(data, params) {
        queryClient.invalidateQueries(scopeQueryKey(params.protocolDashboardID))
        queryClient.invalidateQueries(protocolDashboardQuery(params.protocolDashboardID))
      },
    }
  )

  return {
    addScope,
    ...mutation,
  }
}
