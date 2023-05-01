import { useMutation, useQueryClient } from "react-query"
import { AxiosError } from "axios"
import { contests as contestsAPI } from "../axios"
import { addScope as addScopeUrl } from "../urls"
import { scopeQueryKey } from "./useScope"
import { protocolDashboardQuery } from "../contests/useProtocolDashboard"

type AddScopeParams = {
  protocolDashboardID: string
  repoLink: string
}

type AddScopeErrorType =
  | "repo_not_found"
  | "repo_already_added"
  | "contest_not_found"
  | "invalid_github_url"
  | "repo_already_added"
  | "repo_not_found"
  | "branch_not_found"
  | "fetch_contracts_failed"

export class AddScopeError extends Error {
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
        await contestsAPI.post(addScopeUrl(params.protocolDashboardID), {
          repo_link: params.repoLink,
        })
      } catch (error) {
        const axiosError = error as AxiosError

        throw new AddScopeError(axiosError.response?.data.error)
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
