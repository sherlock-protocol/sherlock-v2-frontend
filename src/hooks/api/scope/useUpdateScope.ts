import { useMutation, useQueryClient } from "react-query"
import { AxiosError } from "axios"
import { contests as contestsAPI } from "../axios"
import { updateScope as updateScopeUrl } from "../urls"
import { Scope, scopeQueryKey } from "./useScope"
import { protocolDashboardQuery } from "../contests/useProtocolDashboard"

type UpdateScopeParams = {
  protocolDashboardID: string
  repoName: string
  commitHash?: string
  branchName?: string
  files?: string[]
}

type UpdateScopeContext = {
  previousScope?: Scope[]
}

export const useUpdateScope = () => {
  const queryClient = useQueryClient()
  const {
    mutate: updateScope,
    mutateAsync,
    ...mutation
  } = useMutation<void, Error, UpdateScopeParams, UpdateScopeContext>(
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
      onMutate: async (params) => {
        await queryClient.invalidateQueries(scopeQueryKey(params.protocolDashboardID))

        const previousScope = queryClient.getQueryData<Scope[]>(scopeQueryKey(params.protocolDashboardID))

        queryClient.setQueryData<Scope[] | undefined>(scopeQueryKey(params.protocolDashboardID), (previous) => {
          if (!previous) return

          const scopeIndex = previous.findIndex((s) => s.repoName === params.repoName)

          if (scopeIndex >= 0) {
            return [
              ...previous.slice(0, scopeIndex),
              {
                repoName: previous[scopeIndex].repoName,
                branchName: params.branchName ?? previous[scopeIndex].branchName,
                commitHash: params.commitHash ?? previous[scopeIndex].commitHash,
                files: params.files
                  ? previous[scopeIndex].files.map((f) => ({
                      ...f,
                      selected: params.files!.includes(f.filePath),
                    }))
                  : previous[scopeIndex].files,
                initialScope: previous[scopeIndex].initialScope,
              },
              ...previous.slice(scopeIndex + 1),
            ]
          }
        })

        return { previousScope }
      },
      onError(err, params, context) {
        console.log("ERROR!")
        queryClient.setQueryData(scopeQueryKey(params.protocolDashboardID), context?.previousScope)
      },
      onSettled(data, error, params) {
        queryClient.invalidateQueries(scopeQueryKey(params.protocolDashboardID))
        queryClient.invalidateQueries(protocolDashboardQuery(params.protocolDashboardID))
      },
    }
  )

  return {
    updateScope,
    ...mutation,
  }
}
