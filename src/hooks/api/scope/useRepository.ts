import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getRepository } from "../urls"

type Branch = {
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
export const useRepository = (repo: string) =>
  useQuery<Repository, Error>(
    useRepositoryQueryKey(repo),
    async () => {
      const { data } = await contestsAPI.get<GetRepositoryResponse>(getRepository(repo))

      return {
        name: repo,
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
