import { useCallback, useState } from "react"
import { FaGithub, FaTrashAlt } from "react-icons/fa"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useAddScope } from "../../hooks/api/scope/useAddScope"
import { shortenCommitHash } from "../../utils/repository"
import { BranchSelectionModal } from "./BranchSelectionModal"
import { CommitSelectionModal } from "./CommitSelectionModal"
import { RepositoryContractsSelector } from "./RepositoryContractsSelector"
import { useParams } from "react-router-dom"
import { useScope } from "../../hooks/api/scope/useScope"
import { useUpdateScope } from "../../hooks/api/scope/useUpdateScope"
import { useDeleteScope } from "../../hooks/api/scope/useDeleteScope"
import { useProtocolDashboard } from "../../hooks/api/contests/useProtocolDashboard"
import { AuditScopeReadOnly } from "./AuditScopeReadOnly"

export const AuditScope = () => {
  const { dashboardID } = useParams()
  const [repoName, setRepoName] = useState("")
  const [branchSelectionModalRepoName, setBranchSelectionModalRepoName] = useState<string>()
  const [commitSelectionModalRepoName, setCommitSelectionModalRepoName] = useState<string>()
  const { data: scope } = useScope(dashboardID)
  const { addScope, isLoading: addScopeIsLoading, error: addScopeError } = useAddScope()
  const { updateScope, isLoading: updateScopeIsLoading, variables: updateParams } = useUpdateScope()
  const { deleteScope } = useDeleteScope()
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")

  const handlePathSelected = useCallback(
    (repo: string, paths: string[]) => {
      console.log(paths)
      let selectedPaths = scope?.find((s) => s.repoName === repo)?.files

      if (!selectedPaths) return

      if (paths.length === 1) {
        const path = paths[0]
        const pathIndex = selectedPaths.indexOf(path)

        if (pathIndex >= 0) {
          selectedPaths.splice(pathIndex, 1)
        } else {
          selectedPaths.push(path)
        }
      } else {
        const addingPaths = paths.some((p) => !selectedPaths?.includes(p))

        if (addingPaths) {
          selectedPaths = [...selectedPaths, ...paths]
        } else {
          selectedPaths = selectedPaths.filter((p) => !paths.includes(p))
        }
      }

      updateScope({
        protocolDashboardID: dashboardID ?? "",
        repoName: repo,
        files: selectedPaths,
      })
    },
    [updateScope, scope, dashboardID]
  )

  const handleSelectBranch = useCallback(
    (repoName: string, branchName: string) => {
      updateScope({
        protocolDashboardID: dashboardID ?? "",
        repoName,
        branchName,
      })
      setBranchSelectionModalRepoName(undefined)
    },
    [updateScope, dashboardID]
  )

  const handleSelectCommit = useCallback(
    (repoName: string, commitHash: string) => {
      updateScope({
        protocolDashboardID: dashboardID ?? "",
        repoName,
        commitHash: commitHash,
      })
      setCommitSelectionModalRepoName(undefined)
    },
    [updateScope, dashboardID]
  )

  const handleAddScope = useCallback(() => {
    addScope({ repoName: repoName, protocolDashboardID: dashboardID ?? "" })
    setRepoName("")
  }, [addScope, dashboardID, repoName])

  const handleDeleteScope = useCallback(
    (repo: string) => {
      deleteScope({
        protocolDashboardID: dashboardID ?? "",
        repoName: repo,
      })
    },
    [deleteScope, dashboardID]
  )

  const handleSelectAll = useCallback(
    (repoName: string, files: string[]) => {
      const repo = scope?.find((s) => s.repoName === repoName)
      if (!repo) return

      updateScope({
        protocolDashboardID: dashboardID ?? "",
        repoName,
        files,
      })
    },
    [updateScope, dashboardID, scope]
  )

  const handleClearSelection = useCallback(
    (repoName: string) => {
      updateScope({
        protocolDashboardID: dashboardID ?? "",
        repoName,
        files: [],
      })
    },
    [updateScope, dashboardID]
  )

  if (protocolDashboard?.contest.submissionReady) return <AuditScopeReadOnly dashboardID={dashboardID ?? ""} />

  return (
    <LoadingContainer loading={addScopeIsLoading || (updateScopeIsLoading && !updateParams?.files)} label="Loading ...">
      <Column spacing="l">
        <Box shadow={false} fullWidth>
          <Column spacing="l">
            <Title variant="h2">SCOPE</Title>
            <Column spacing="s">
              <Text>Copy & paste the Github repository link(s) you would like to audit</Text>
              <Input value={repoName} onChange={setRepoName} />
              <Button disabled={addScopeIsLoading || repoName === ""} onClick={handleAddScope}>
                {addScopeIsLoading ? "Adding repo ..." : "Add repo"}
              </Button>
              {addScopeError && (
                <Column spacing="m">
                  {addScopeError.type === "repo_not_found" ? (
                    <>
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
                    </>
                  ) : (
                    <Text variant="secondary">This repo was already added.</Text>
                  )}
                </Column>
              )}
            </Column>
          </Column>
        </Box>
        {scope && scope.length > 0 ? (
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
                    {scope?.map((s) => (
                      <Input value={s.repoName} key={s.repoName} variant="small" disabled />
                    ))}
                  </Column>
                  <Column spacing="s">
                    <Text size="small" strong>
                      Branch
                    </Text>
                    {scope?.map((s) => (
                      <Button
                        key={s.repoName}
                        variant="secondary"
                        onClick={() => setBranchSelectionModalRepoName(s.repoName)}
                      >
                        {s.branchName}
                      </Button>
                    ))}
                  </Column>
                  <Column spacing="s">
                    <Text size="small" strong>
                      Commit hash
                    </Text>
                    {scope?.map((s) => (
                      <Button
                        key={s.repoName}
                        variant="secondary"
                        onClick={() => setCommitSelectionModalRepoName(s.repoName)}
                      >
                        {shortenCommitHash(s.commitHash)}
                      </Button>
                    ))}
                  </Column>
                  <Column spacing="s">
                    <Text size="small">Remove</Text>
                    {scope?.map((s) => (
                      <Button key={s.repoName} variant="secondary" icon onClick={() => handleDeleteScope(s.repoName)}>
                        <FaTrashAlt />
                      </Button>
                    ))}
                  </Column>
                </Row>
              </Column>
            </Column>
          </Box>
        ) : null}
        {scope?.map((s) => (
          <Box shadow={false} fullWidth key={`contracts-${s.repoName}`}>
            <Column spacing="l">
              <Title variant="h2">
                <FaGithub />
                &nbsp;
                {s.repoName}
              </Title>
              <RepositoryContractsSelector
                repo={s.repoName}
                commit={s.commitHash}
                onPathSelected={(paths) => handlePathSelected(s.repoName, paths)}
                selectedPaths={s.files}
                onSelectAll={(files) => handleSelectAll(s.repoName, files)}
                onClearSelection={() => handleClearSelection(s.repoName)}
              />
            </Column>
          </Box>
        ))}
        {branchSelectionModalRepoName && (
          <BranchSelectionModal
            repoName={branchSelectionModalRepoName}
            selectedBranch={scope?.find((s) => s.repoName === branchSelectionModalRepoName)?.branchName}
            onSelectBranch={(branch) => handleSelectBranch(branchSelectionModalRepoName, branch)}
            onClose={() => setBranchSelectionModalRepoName(undefined)}
          />
        )}
        {commitSelectionModalRepoName && (
          <CommitSelectionModal
            repoName={commitSelectionModalRepoName}
            branchName={scope?.find((s) => s.repoName === commitSelectionModalRepoName)?.branchName ?? ""}
            selectedCommit={scope?.find((s) => s.repoName === commitSelectionModalRepoName)?.commitHash ?? ""}
            onSelectCommit={(commit) => handleSelectCommit(commitSelectionModalRepoName, commit)}
            onClose={() => setCommitSelectionModalRepoName(undefined)}
          />
        )}
      </Column>
    </LoadingContainer>
  )
}
