import { useCallback, useEffect, useMemo, useState } from "react"
import { FaGithub } from "react-icons/fa"
import { useDebounce } from "use-debounce"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Input } from "../../../components/Input"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminSubmitScope } from "../../../hooks/api/admin/useAdminSubmitScope"
import { useRepository } from "../../../hooks/api/scope/useRepository"
import { shortenCommitHash } from "../../../utils/repository"
import { BranchSelectionModal } from "../../AuditScope/BranchSelectionModal"
import { CommitSelectionModal } from "../../AuditScope/CommitSelectionModal"
import { RepositoryContractsSelector } from "../../AuditScope/RepositoryContractsSelector"
import { repositoryContractsQuery, useRepositoryContracts } from "../../../hooks/api/scope/useRepositoryContracts"
import { SaveScopeSuccessModal } from "./SaveScopeSuccessModal"
import { ScopeErrorModal } from "./ScopeErrorModal"
import { useQueryClient } from "react-query"

export const AdminScope = () => {
  const [repoLink, setRepoLink] = useState("")
  const [repoName, setRepoName] = useState("")
  const [debouncedRepoName] = useDebounce(repoName, 300)
  const [branchName, setBranchName] = useState<string>()
  const [commitHash, setCommitHash] = useState<string>()
  const [nSLOCAdjustment, setNSLOCAdjustment] = useState<number>()
  const [files, setFiles] = useState<string[]>([])

  const [branchSelectionModalOpen, setBranchSelectionModalOpen] = useState(false)
  const [commitSelectionModalOpen, setCommitSelectionModalOpen] = useState(false)

  const { data: repo, isLoading: repoIsLoading } = useRepository(debouncedRepoName)
  const { submitScope, isLoading, data: report, isSuccess } = useAdminSubmitScope()

  const {
    data: repoContracts,
    isLoading: isLoadingContracts,
    error: contractsError,
  } = useRepositoryContracts(debouncedRepoName, commitHash ?? "")

  const queryClient = useQueryClient()

  useEffect(() => {
    const pattern = /^https?:\/\/github\.com\/([A-Za-z0-9-]+\/[A-Za-z0-9-]+)(?:\.git)?(?:\/tree\/([A-Za-z0-9-]+))?$/
    const match = repoLink.match(pattern)

    if (match) {
      setRepoName(match[1])
      setBranchName(match.at(2))
    }
  }, [repoLink])

  useEffect(() => {
    if (repo) {
      if (!branchName) setBranchName(repo.mainBranch.name)
      setCommitHash(repo.mainBranch.commit)
    }
  }, [repo, branchName])

  const handleErrorModalClose = useCallback(() => {
    window.location.reload()
  }, [])

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
    (branch: string, commit: string) => {
      setBranchName(branch)
      setCommitHash(commit)
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

  const handleSelectAll = useCallback(() => {
    setFiles(repoContracts?.rawPaths ?? [])
  }, [repoContracts])

  const handleClearSelection = useCallback(() => {
    setFiles([])
  }, [setFiles])

  const canGenerateReport = useMemo(() => {
    return repo?.name && branchName && commitHash && files.length > 0
  }, [branchName, commitHash, files.length, repo?.name])

  const handleGenerateReport = useCallback(() => {
    if (!canGenerateReport) return

    submitScope({
      projectName: repo!.name.split("/").pop() ?? "",
      repoName: repo!.name,
      branchName: branchName!,
      commitHash: commitHash!,
      files,
      nSLOCAdjustment,
    })
  }, [canGenerateReport, submitScope, repo, branchName, commitHash, files, nSLOCAdjustment])

  return (
    <LoadingContainer
      loading={isLoading || repoIsLoading || isLoadingContracts}
      label={repoIsLoading || isLoadingContracts ? "Analyzing repo ..." : "Saving scope ..."}
    >
      <Row spacing="l">
        <Column spacing="l">
          <Box shadow={false} fullWidth>
            <Column spacing="l">
              <Title variant="h2">SCOPE</Title>
              <Column spacing="s">
                <Text>Copy & paste the Github repository link(s) you would like to audit</Text>
                <Input value={repoLink} onChange={setRepoLink} />
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
          {repo && (
            <Box shadow={false}>
              <Column spacing="m">
                <Title variant="h2">nSLOC Adjustment</Title>
                <Input type="number" onChange={setNSLOCAdjustment} value={nSLOCAdjustment} />
              </Column>
            </Box>
          )}
          {repo && (
            <Box shadow={false}>
              <Button onClick={handleGenerateReport} disabled={!canGenerateReport}>
                Save scope
              </Button>
            </Box>
          )}
        </Column>
        <Column spacing="l">
          {repo?.name && commitHash && (
            <Box shadow={false} fullWidth>
              <Column spacing="l">
                <Title variant="h2">
                  <FaGithub />
                  &nbsp;
                  {repo.name}
                </Title>
                {repoContracts ? (
                  <RepositoryContractsSelector
                    tree={repoContracts.tree}
                    onPathSelected={handlePathSelected}
                    selectedPaths={files}
                    onSelectAll={handleSelectAll}
                    onClearSelection={handleClearSelection}
                  />
                ) : null}
              </Column>
            </Box>
          )}
          {isSuccess && <SaveScopeSuccessModal reportURL={report} />}
          {contractsError && <ScopeErrorModal onClose={handleErrorModalClose} />}
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
      </Row>
    </LoadingContainer>
  )
}
