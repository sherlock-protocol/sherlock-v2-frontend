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
  const repo_name = repo.startsWith("https://github.com/") ? repo.replace("https://github.com/", "") : repo

  return useQuery<Repository, Error>(
    useRepositoryQueryKey(repo_name),
    async () => {
      const { data } = await contestsAPI.get<GetRepositoryResponse>(getRepositoryBranches(repo_name))

      return {
        name: repo_name,
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
    },
    {
      enabled: false,
    }
  )
}
