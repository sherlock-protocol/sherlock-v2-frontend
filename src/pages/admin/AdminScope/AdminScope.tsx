import { useCallback, useEffect, useState } from "react"
import { FaGithub } from "react-icons/fa"
import { useDebounce } from "use-debounce"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Input } from "../../../components/Input"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useRepository } from "../../../hooks/api/scope/useRepository"
import { shortenCommitHash } from "../../../utils/repository"
import { BranchSelectionModal } from "../../AuditScope/BranchSelectionModal"
import { CommitSelectionModal } from "../../AuditScope/CommitSelectionModal"
import { RepositoryContractsSelector } from "../../AuditScope/RepositoryContractsSelector"

export const AdminScope = () => {
  const [repoName, setRepoName] = useState("")
  const [debouncedRepoName] = useDebounce(repoName, 300)
  const [branchName, setBranchName] = useState<string>()
  const [commitHash, setCommitHash] = useState<string>()
  const [files, setFiles] = useState<string[]>([])

  const [branchSelectionModalOpen, setBranchSelectionModalOpen] = useState(false)
  const [commitSelectionModalOpen, setCommitSelectionModalOpen] = useState(false)

  const { data: repo } = useRepository(debouncedRepoName)

  useEffect(() => {
    if (repo) {
      setBranchName(repo.mainBranch.name)
      setCommitHash(repo.mainBranch.commit)
    }
  }, [repo])

  const handlePathSelected = useCallback(
    (selectedPaths: string[]) => {
      setFiles((f) => {
        if (selectedPaths.some((p) => f.includes(p))) {
          return f.filter((p) => !selectedPaths.includes(p))
        }

        return [...f, ...selectedPaths]
      })
    },
    [setFiles]
  )

  const handleSelectBranch = useCallback(
    (branch: string) => {
      setBranchName(branch)
      setBranchSelectionModalOpen(false)
    },
    [setBranchName]
  )
  const handleSelectCommit = useCallback(
    (commit: string) => {
      setCommitHash(commit)
      setCommitSelectionModalOpen(false)
    },
    [setCommitHash]
  )

  const handleSelectAll = useCallback(
    (selectedPaths: string[]) => {
      setFiles(selectedPaths)
    },
    [setFiles]
  )

  const handleClearSelection = useCallback(() => {
    setFiles([])
  }, [setFiles])

  return (
    <LoadingContainer loading={false} label="Loading ...">
      <Column spacing="l">
        <Box shadow={false} fullWidth>
          <Column spacing="l">
            <Title variant="h2">SCOPE</Title>
            <Column spacing="s">
              <Text>Copy & paste the Github repository link(s) you would like to audit</Text>
              <Input value={repoName} onChange={setRepoName} />
            </Column>
          </Column>
        </Box>
        {branchName && commitHash && (
          <Box shadow={false}>
            <Column spacing="m">
              <Title variant="h2">Branch & commit</Title>
              <Row alignment="start" spacing="l">
                <Button variant="secondary" onClick={() => setBranchSelectionModalOpen(true)}>
                  {branchName}
                </Button>
                <Button variant="secondary" onClick={() => setCommitSelectionModalOpen(true)}>
                  {shortenCommitHash(commitHash)}
                </Button>
              </Row>
            </Column>
          </Box>
        )}
        {repo?.name && commitHash && (
          <Box shadow={false} fullWidth>
            <Column spacing="l">
              <Title variant="h2">
                <FaGithub />
                &nbsp;
                {repo.name}
              </Title>
              <RepositoryContractsSelector
                repo={repo?.name}
                commit={commitHash}
                onPathSelected={handlePathSelected}
                selectedPaths={files}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
              />
            </Column>
          </Box>
        )}
        {branchSelectionModalOpen && (
          <BranchSelectionModal
            repoName={repo?.name ?? ""}
            selectedBranch={branchName}
            onSelectBranch={handleSelectBranch}
            onClose={() => setBranchSelectionModalOpen(false)}
          />
        )}
        {commitSelectionModalOpen && (
          <CommitSelectionModal
            repoName={repo?.name ?? ""}
            branchName={branchName ?? ""}
            selectedCommit={commitHash}
            onSelectCommit={handleSelectCommit}
            onClose={() => setCommitSelectionModalOpen(false)}
          />
        )}
      </Column>
    </LoadingContainer>
  )
}
