import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getRepositoryCommits } from "../urls"

type GetRepositoryCommitsResponse = {
  commits: string[]
}

export const useRepositoryCommitsQueryKey = (repo: string, branch: string) => ["repository-commits", repo, branch]
export const useRepositoryCommits = (repo: string, branch: string) =>
  useQuery<string[], Error>(useRepositoryCommitsQueryKey(repo, branch), async () => {
    const { data } = await contestsAPI.get<GetRepositoryCommitsResponse>(getRepositoryCommits(repo, branch))

    return data.commits
  })
