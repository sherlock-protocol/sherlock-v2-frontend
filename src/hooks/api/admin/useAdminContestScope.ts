import { useQuery } from "react-query"
import { Scope } from "../scope/useScope"
import { contests as contestsAPI } from "../axios"
import { getAdminContestScope as getAdminContestScopeUrl } from "../urls"

type AdminContestScopeResponse = {
  scope: {
    repo_name: string
    branch_name: string
    commit_hash: string
    files: {
      file_path: string
      nsloc?: number
      selected: boolean
    }[]
    solidity_metrics_report: string
    nsloc: number
    comment_to_source_ratio: number
  }[]
}

export const adminContestScopeQuery = (contestID: number) => ["admin-contest-scope", contestID]
export const useAdminContestScope = (contestID: number) =>
  useQuery<Scope[], Error>(adminContestScopeQuery(contestID), async () => {
    const { data } = await contestsAPI.get<AdminContestScopeResponse>(getAdminContestScopeUrl(contestID))

    return data.scope.map((d) => ({
      repoName: d.repo_name,
      branchName: d.branch_name,
      commitHash: d.commit_hash,
      files: d.files.map((f) => ({
        filePath: f.file_path,
        nSLOC: f.nsloc,
        selected: f.selected,
      })),
      solidityMetricsReport: d.solidity_metrics_report,
      nSLOC: d.nsloc,
      commentToSourceRatio: d.comment_to_source_ratio,
    }))
  })
