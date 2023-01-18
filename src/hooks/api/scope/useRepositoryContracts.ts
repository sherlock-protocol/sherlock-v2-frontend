import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getRepositoryContracts as getRepositoryContractsUrl } from "../urls"

type GetRepositoryContractsResponse = string[]

export type TreeValue = Tree | string
export interface Tree extends Map<string, TreeValue> {}

export const repositoryContractsQuery = (repo: string, commit: string) => ["repository-contracts", repo, commit]
export const useRepositoryContracts = (repo: string, commit: string) =>
  useQuery<Tree, Error>(repositoryContractsQuery(repo, commit), async () => {
    const { data } = await contestsAPI.get<GetRepositoryContractsResponse>(getRepositoryContractsUrl(repo, commit))

    const tree: Tree = new Map()

    data.forEach((d) => {
      const parts = d.split("/")
      let current: Tree = tree
      parts.forEach((p) => {
        if (p.endsWith(".sol")) {
          current.set(p, p)
        } else {
          if (!current.get(p)) current.set(p, new Map())
          current = current.get(p) as Tree
        }
      })
    })

    return tree
  })
