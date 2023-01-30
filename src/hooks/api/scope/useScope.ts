import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getScope as getScopeUrl } from "../urls"

export type Scope = {
  repoName: string
  branchName: string
  commitHash: string
  files: string[]
}[]

export type GetScopeResponse = {
  scope: {
    repo_name: string
    branch_name: string
    commit_hash: string
    files: string[]
  }[]
}

export const useScopeQueryKey = (dashboardID?: string) => ["scope", dashboardID]
export const useScope = (dashboardID?: string) =>
  useQuery<Scope, Error>(
    useScopeQueryKey(dashboardID),
    async () => {
      const { data } = await contestsAPI.get<GetScopeResponse>(getScopeUrl(dashboardID ?? ""))

      return data.scope.map((d) => ({
        repoName: d.repo_name,
        branchName: d.branch_name,
        commitHash: d.commit_hash,
        files: d.files,
      }))
    },
    {
      enabled: !!dashboardID,
    }
  )
