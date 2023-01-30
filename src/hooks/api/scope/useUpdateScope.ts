import { useMutation } from "react-query"
import { AxiosError } from "axios"
import { contests as contestsAPI } from "../axios"
import { updateScope as updateScopeUrl } from "../urls"

type UpdateScopeParams = {
  protocolDashboardID: string
  repoName: string
  commitHash?: string
  files?: string[]
}

export const useAddScope = () => {
  const {
    mutate: updateScope,
    mutateAsync,
    ...mutation
  } = useMutation<void, Error, UpdateScopeParams>(async (params) => {
    try {
      await contestsAPI.put(updateScopeUrl(params.protocolDashboardID, params.repoName), {
        commit_hash: params.commitHash,
        files: params.files,
      })
    } catch (error) {
      const axiosError = error as AxiosError
      throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
    }
  })

  return {
    updateScope,
    ...mutation,
  }
}
