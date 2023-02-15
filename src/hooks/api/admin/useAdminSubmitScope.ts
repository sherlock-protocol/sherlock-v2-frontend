import { AxiosError } from "axios"
import { useMutation } from "react-query"
import { contests as contestsAPI } from "../axios"
import { adminSubmitScope as adminSubmitScopeUrl } from "../urls"

type AdminSubmitScopeParams = {
  projectName: string
  repoName: string
  branchName: string
  commitHash: string
  files: string[]
}

type AdminSubmitScopeResponse = {
  report: {
    url: string
    nSLOC: number
  }
}

type Report = {
  url: string
  nSLOC: number
}

export const useAdminSubmitScope = () => {
  const {
    mutate: submitScope,
    mutateAsync,
    ...mutation
  } = useMutation<Report, Error, AdminSubmitScopeParams>(async (params) => {
    try {
      const { data } = await contestsAPI.post<AdminSubmitScopeResponse>(
        adminSubmitScopeUrl(),
        {
          project_name: params.projectName,
          repo_name: params.repoName,
          branch_name: params.branchName,
          commit_hash: params.commitHash,
          files: params.files,
        },
        {
          timeout: 5 * 60 * 1000,
        }
      )

      return {
        url: data.report.url,
        nSLOC: data.report.nSLOC,
      }
    } catch (error) {
      const axiosError = error as AxiosError
      throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
    }
  })

  return {
    submitScope,
    ...mutation,
  }
}
