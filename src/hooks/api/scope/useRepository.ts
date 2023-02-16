import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getRepositoryBranches } from "../urls"

export type Branch = {
  name: string
  commit: string
}

export type Repository = {
  name: string
  mainBranch: Branch
  branches: Branch[]
}

type GetRepositoryResponse = {
  branch: string
  commit: string
}[]

export const useRepositoryQueryKey = (repo: string) => ["repository", repo]
export const useRepository = (repo: string) => {
  return useQuery<Repository, Error>(useRepositoryQueryKey(repo), async () => {
    const repoName = repo.startsWith("https://github.com/") ? repo.replace("https://github.com/", "") : repo
    const { data } = await contestsAPI.get<GetRepositoryResponse>(getRepositoryBranches(repoName))

    return {
      name: repoName,
      // first branch is the main one
      mainBranch: {
        name: data[0].branch,
        commit: data[0].commit,
      },
      branches: data.map((b) => ({
        name: b.branch,
        commit: b.commit,
      })),
    }
  })
}
