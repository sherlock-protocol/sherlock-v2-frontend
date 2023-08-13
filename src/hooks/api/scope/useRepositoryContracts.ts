import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getRepositoryContracts as getRepositoryContractsUrl } from "../urls"

type GetRepositoryContractsResponse = string[]

type File = {
  filepath: string
  nsloc?: number
}

interface BaseEntry {
  name: string
}

export interface FileEntry extends BaseEntry {
  type: "file"
  filepath: string
  nsloc?: number
}

interface DirectoryEntry extends BaseEntry {
  type: "directory"
  entries: Array<Entry>
}

export type Entry = FileEntry | DirectoryEntry

type AnyEntry = RootDirectory | DirectoryEntry

export interface RootDirectory {
  type: "root"
  entries: Array<Entry>
}

export const convertToTree2 = (files: File[]) => {
  const root: RootDirectory = {
    type: "root",
    entries: [],
  }

  files.forEach(({ filepath, nsloc }) => {
    const parts = filepath.split("/")

    let current: AnyEntry = root

    parts.forEach((p) => {
      if (p.endsWith(".sol") || p.endsWith(".vy")) {
        current.entries.push({
          type: "file",
          name: p,
          filepath,
          nsloc,
        })
      } else {
        let directory: DirectoryEntry | undefined = current.entries.find(
          (e) => e.type === "directory" && e.name === p
        ) as DirectoryEntry

        if (!directory) {
          directory = {
            type: "directory",
            name: p,
            entries: [],
          }
          current.entries.push(directory)
        }

        current = directory
      }
    })
  })

  return root
}

export type TreeValue = Tree | string
export interface Tree extends Map<string, TreeValue> {}

export const getAllTreePaths = (parentPath: string, tree: Entry) => {
  if (tree.type === "file") {
    return [`${parentPath}`]
  }

  let paths: string[] = []

  tree.entries.forEach((value, key) => {
    paths = [...paths, ...getAllTreePaths(`${parentPath}/${value.name}`, value)]
  })

  return paths
}

type RepositoryContracts = {
  tree: RootDirectory
  rawPaths: string[]
}

export const repositoryContractsQuery = (repo: string, commit: string) => ["repository-contracts", repo, commit]
export const useRepositoryContracts = (repo: string, commit: string) =>
  useQuery<RepositoryContracts, Error>(repositoryContractsQuery(repo, commit), async () => {
    const { data } = await contestsAPI.get<GetRepositoryContractsResponse>(getRepositoryContractsUrl(repo, commit))

    const tree = convertToTree2(data.map((f) => ({ filepath: f })))

    return {
      tree,
      rawPaths: data,
    }
  })
