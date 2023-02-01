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

type AddScopeErrorType = "repo_not_found" | "repo_already_added"

class AddScopeError extends Error {
  type: AddScopeErrorType

  constructor(type: AddScopeErrorType) {
    super()
    this.type = type
  }
}

export const useAddScope = () => {
  const queryClient = useQueryClient()

  const {
    mutate: addScope,
    mutateAsync,
    ...mutation
  } = useMutation<void, AddScopeError, AddScopeParams>(
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

        if (axiosError.response?.status === 422) {
          throw new AddScopeError("repo_already_added")
        } else {
          throw new AddScopeError("repo_not_found")
        }
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
