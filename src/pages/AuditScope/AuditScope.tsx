import { useCallback, useEffect, useState } from "react"
import { FaGithub } from "react-icons/fa"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useRepository, Branch } from "../../hooks/api/scope/useRepository"
import { shortenCommitHash } from "../../utils/repository"
import { BranchSelectionModal } from "./BranchSelectionModal"
import { CommitSelectionModal } from "./CommitSelectionModal"
import { RepositoryContractsSelector } from "./RepositoryContractsSelector"

type RepositoryState = {
  name: string
  branch: string
  commit: string
  branches: Branch[]
}

export const AuditScope = () => {
  const [repoName, setRepoName] = useState("")
  const [repositories, setRepositories] = useState<RepositoryState[]>([])
  const [selectedPaths, setSelectedPaths] = useState<Record<string, string[]>>({})
  const [branchSelectionModalRepoName, setBranchSelectionModalRepoName] = useState<string>()
  const [commitSelectionModalRepoName, setCommitSelectionModalRepoName] = useState<string>()
  const { data: repo, refetch: validateRepo, isLoading, isError } = useRepository(repoName)

  useEffect(() => {
    if (repo && !repositories.some((r) => r.name === repo.name)) {
      setRepositories((r) => [
        ...r,
        {
          name: repo.name,
          branch: repo.mainBranch.name,
          commit: repo.mainBranch.commit,
          branches: repo.branches,
        },
      ])
      setRepoName("")
    }
  }, [repo, repositories])

  const handlePathSelected = useCallback(
    (repo: string, path: string) => {
      let paths = selectedPaths[repo] ?? []
      const currentIndex = paths.indexOf(path)

      if (currentIndex >= 0) {
        delete paths[currentIndex]
      } else {
        paths = [...paths, path]
      }

      setSelectedPaths((p) => ({
        ...p,
        [repo]: paths,
      }))
    },
    [selectedPaths, setSelectedPaths]
  )

  const handleSelectBranch = useCallback(
    (repoName: string, branchName: string) => {
      const repoIndex = repositories.findIndex((r) => r.name === repoName)
      const branch = repositories[repoIndex].branches.find((b) => b.name === branchName)

      if (repoIndex < 0) return
      if (!branch) return

      setRepositories((r) => {
        r[repoIndex] = {
          ...r[repoIndex],
          branch: branchName,
          commit: branch.commit,
        }
        return r
      })
      setBranchSelectionModalRepoName(undefined)
    },
    [setRepositories, repositories]
  )

  const handleSelectCommit = useCallback(
    (repoName: string, commitHash: string) => {
      const repoIndex = repositories.findIndex((r) => r.name === repoName)
      if (repoIndex < 0) return

      setRepositories((r) => {
        r[repoIndex] = {
          ...r[repoIndex],
          commit: commitHash,
        }
        return r
      })
      setCommitSelectionModalRepoName(undefined)
    },
    [repositories]
  )

  return (
    <Column spacing="l">
      <Box shadow={false} fullWidth>
        <Column spacing="l">
          <Title>Repositories</Title>
          <Column spacing="s">
            <Text>Copy & paste the Github repository link(s) you would like to audit</Text>
            <Input value={repoName} onChange={setRepoName} />
            <Button disabled={isLoading || repoName === ""} onClick={() => validateRepo()}>
              {isLoading ? "Validating repo ..." : "Add repo"}
            </Button>
            {isError && (
              <Column spacing="m">
                <Text variant="secondary">We couldn't find the repo.</Text>
                <Text variant="secondary">
                  If it's private, make sure to invite{" "}
                  <strong>
                    <a href="https://github.com/sherlock-admin" target="_blank" rel="noreferrer">
                      sherlock-admin
                    </a>
                  </strong>{" "}
                  and try again.
                </Text>
              </Column>
            )}
          </Column>
        </Column>
      </Box>
      {repositories.length > 0 ? (
        <Box shadow={false} fullWidth>
          <Column spacing="l">
            <Title>Branches & commits</Title>
            <Column spacing="s">
              <Text>Select branch and commit hash</Text>
              <Row spacing="m">
                <Column spacing="s" grow={1}>
                  <Text size="small" strong>
                    Repo
                  </Text>
                  {repositories.map((r) => (
                    <Input value={r.name} variant="small" disabled />
                  ))}
                </Column>
                <Column spacing="s">
                  <Text size="small" strong>
                    Branch
                  </Text>
                  {repositories.map((r) => (
                    <Button variant="secondary" onClick={() => setBranchSelectionModalRepoName(r.name)}>
                      {r.branch}
                    </Button>
                  ))}
                </Column>
                <Column spacing="s">
                  <Text size="small" strong>
                    Commit hash
                  </Text>
                  {repositories.map((r) => (
                    <Button variant="secondary" onClick={() => setCommitSelectionModalRepoName(r.name)}>
                      {shortenCommitHash(r.commit)}
                    </Button>
                  ))}
                </Column>
              </Row>
            </Column>
          </Column>
        </Box>
      ) : null}
      {repositories.map((r) => (
        <Box shadow={false} fullWidth>
          <Column spacing="l">
            <Title variant="h2">
              <FaGithub />
              &nbsp;
              {r.name}
            </Title>
            <RepositoryContractsSelector
              repo={r.name}
              commit={r.commit}
              onPathSelected={(path) => handlePathSelected(r.name, path)}
              selectedPaths={selectedPaths[r.name]}
            />
          </Column>
        </Box>
      ))}
      {branchSelectionModalRepoName && (
        <BranchSelectionModal
          repoName={branchSelectionModalRepoName}
          selectedBranch={repositories.find((r) => r.name === branchSelectionModalRepoName)?.branch}
          onSelectBranch={(branch) => handleSelectBranch(branchSelectionModalRepoName, branch)}
          onClose={() => setBranchSelectionModalRepoName(undefined)}
        />
      )}
      {commitSelectionModalRepoName && (
        <CommitSelectionModal
          repoName={commitSelectionModalRepoName}
          branchName={repositories.find((r) => r.name === commitSelectionModalRepoName)?.branch ?? ""}
          selectedCommit={repositories.find((r) => r.name === commitSelectionModalRepoName)?.commit}
          onSelectCommit={(commit) => handleSelectCommit(commitSelectionModalRepoName, commit)}
          onClose={() => setCommitSelectionModalRepoName(undefined)}
        />
      )}
    </Column>
  )
}
