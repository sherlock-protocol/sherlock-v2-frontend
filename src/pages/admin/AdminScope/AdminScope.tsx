import { useCallback, useEffect, useMemo, useState } from "react"
import { FaCopy, FaDownload, FaGithub } from "react-icons/fa"
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

export const AdminScope = () => {
  const [repoLink, setRepoLink] = useState("")
  const [repoName, setRepoName] = useState("")
  const [debouncedRepoName] = useDebounce(repoName, 300)
  const [branchName, setBranchName] = useState<string>()
  const [commitHash, setCommitHash] = useState<string>()
  const [files, setFiles] = useState<string[]>([])

  const [branchSelectionModalOpen, setBranchSelectionModalOpen] = useState(false)
  const [commitSelectionModalOpen, setCommitSelectionModalOpen] = useState(false)

  const { data: repo, isLoading: repoIsLoading } = useRepository(debouncedRepoName)
  const { submitScope, isLoading, data: report } = useAdminSubmitScope()

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

  const handleSelectAll = useCallback(
    (selectedPaths: string[]) => {
      setFiles(selectedPaths)
    },
    [setFiles]
  )

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
    })
  }, [canGenerateReport, submitScope, repo, branchName, commitHash, files])

  const handleDownloadReport = useCallback(() => {
    if (report?.url) {
      window.open(report.url, "blank")
    }
  }, [report])

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(report?.url ?? "")
  }, [report?.url])

  return (
    <LoadingContainer loading={isLoading || repoIsLoading} label={repoIsLoading ? "" : "Generating report ..."}>
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
              {report ? (
                <Column spacing="m">
                  <Row spacing="s">
                    <Text strong>nSLOC:</Text>
                    <Text>{report.nSLOC}</Text>
                  </Row>
                  <Row spacing="s">
                    <Column grow={1}>
                      <Button onClick={handleDownloadReport}>
                        <FaDownload />
                        &nbsp;Download report
                      </Button>
                    </Column>
                    <Button variant="secondary" onClick={handleCopyLink}>
                      <FaCopy />
                    </Button>
                  </Row>
                </Column>
              ) : (
                <Button onClick={handleGenerateReport} disabled={!canGenerateReport}>
                  Generate report
                </Button>
              )}
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
      </Row>
    </LoadingContainer>
  )
}
