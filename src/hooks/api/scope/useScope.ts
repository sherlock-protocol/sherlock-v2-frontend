import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getScope as getScopeUrl } from "../urls"

export type Scope = {
  repoName: string
  branchName: string
  commitHash: string
  files: {
    filePath: string
    nSLOC?: number
    selected: boolean
  }[]
  solidityMetricsReport?: string
  commentToSourceRatio?: number
  initialScope?: Scope
}

type ScopeResponse = {
  repo_name: string
  branch_name: string
  commit_hash: string
  files: {
    file_path: string
    nsloc?: number
    selected: boolean
  }[]
  comment_to_source_ratio?: number
  initial_scope?: Omit<ScopeResponse, "initial_scope">
}

export type GetScopeResponse = {
  scope: ScopeResponse[]
}

function parseScope(d: ScopeResponse): Scope {
  return {
    repoName: d.repo_name,
    branchName: d.branch_name,
    commitHash: d.commit_hash,
    files: d.files.map((f) => ({
      filePath: f.file_path,
      nSLOC: f.nsloc,
      selected: f.selected,
    })),
    commentToSourceRatio: d.comment_to_source_ratio,
    initialScope: d.initial_scope ? parseScope(d.initial_scope) : undefined,
  }
}

export const scopeQueryKey = (dashboardID?: string) => ["scope", dashboardID]
export const useScope = (dashboardID?: string) =>
  useQuery<Scope[], Error>(
    scopeQueryKey(dashboardID),
    async () => {
      const { data } = await contestsAPI.get<GetScopeResponse>(getScopeUrl(dashboardID ?? ""))

      return data.scope.map(parseScope)
    },
    {
      enabled: !!dashboardID,
    }
  )
