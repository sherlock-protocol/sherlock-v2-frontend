import { useCallback, useEffect, useMemo, useState } from "react"
import { FaCheckCircle, FaGithub, FaMinusCircle, FaPlusCircle, FaRegDotCircle, FaTrashAlt } from "react-icons/fa"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { AddScopeError, useAddScope } from "../../hooks/api/scope/useAddScope"
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
import Modal, { Props as ModalProps } from "../../components/Modal/Modal"
import { useSubmitScope } from "../../hooks/api/contests/useSubmitScope"
import { ErrorModal } from "../ContestDetails/ErrorModal"
import { convertToTree2 } from "../../hooks/api/scope/useRepositoryContracts"

import styles from "./AuditScope.module.scss"

type Props = ModalProps & {
  dashboardID: string
}

const ErrorMessage: React.FC<{ error: AddScopeError }> = ({ error }) => {
  switch (error.type) {
    case "repo_not_found":
      return (
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
      )
    case "branch_not_found":
      return <Text variant="warning">Branch not found</Text>
    case "invalid_github_url":
      return <Text variant="warning">Invalid Github URL</Text>
    case "repo_already_added":
      return <Text>This repo was already added</Text>

    default:
      return null
  }
}

const SubmitScopeModal: React.FC<Props> = ({ onClose, dashboardID }) => {
  const { submitScope, isLoading, isSuccess, error, reset } = useSubmitScope()

  useEffect(() => {
    if (isSuccess) {
      onClose?.()
    }
  }, [isSuccess, onClose])

  const handleCancelClick = useCallback(() => {
    onClose?.()
  }, [onClose])

  const handleConfirmClick = useCallback(() => {
    submitScope({ dashboardID })
  }, [submitScope, dashboardID])

  return (
    <Modal closeable onClose={onClose}>
      <LoadingContainer loading={isLoading} label="Setting up repo. This might take a few minutes.">
        <Column spacing="xl">
          <Title>Submit scope</Title>
          <Text>The contents from your scope repositories will be copied over to the audit repo.</Text>
          <Text>Once you confirm this action, the scope of the audit cannot be changed.</Text>
          <Row spacing="l" alignment={["center"]}>
            <Button variant="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button onClick={handleConfirmClick}>Confirm</Button>
          </Row>
        </Column>
      </LoadingContainer>
      {error && <ErrorModal reason={error?.message} onClose={() => reset()} />}
    </Modal>
  )
}

export const AuditScope = () => {
  const { dashboardID } = useParams()
  const [repoName, setRepoName] = useState("")
  const [branchSelectionModalRepoName, setBranchSelectionModalRepoName] = useState<string>()
  const [commitSelectionModalRepoName, setCommitSelectionModalRepoName] = useState<string>()
  const [submitScopeModalOpen, setSubmitScopeModalOpen] = useState(false)
  const { data: scope } = useScope(dashboardID)
  const { addScope, isLoading: addScopeIsLoading, error: addScopeError } = useAddScope()
  const { updateScope, isLoading: updateScopeIsLoading, variables: updateParams } = useUpdateScope()
  const { deleteScope } = useDeleteScope()
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")

  const handlePathSelected = useCallback(
    (repo: string, paths: string[]) => {
      let selectedPaths = scope
        ?.find((s) => s.repoName === repo)
        ?.files.filter((f) => f.selected)
        .map((f) => f.filePath)

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
    addScope({ repoLink: repoName, protocolDashboardID: dashboardID ?? "" })
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
    (repoName: string) => {
      const s = scope?.find((s) => s.repoName === repoName)
      if (!s) return

      updateScope({
        protocolDashboardID: dashboardID ?? "",
        repoName,
        files: s.files.map((f) => f.filePath),
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

  const selectedFiles = useMemo(() => {
    return scope && scope.every((s) => s.files.length > 0)
  }, [scope])

  if (protocolDashboard?.contest.scopeReady) return <AuditScopeReadOnly dashboardID={dashboardID ?? ""} />

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
              {addScopeError && <ErrorMessage error={addScopeError} />}
            </Column>
          </Column>
        </Box>
        {scope && scope.length > 0 ? (
          <>
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
            <Box shadow={false} fullWidth>
              <Column spacing="xl">
                <Title variant="h2">Legend</Title>
                <Column spacing="s">
                  <Row spacing="s">
                    <FaCheckCircle className={styles.fileSame} />
                    <Text variant="secondary">
                      File selected in both original and current scope. No change in nSLOC.
                    </Text>
                  </Row>
                  <Row spacing="s">
                    <FaRegDotCircle className={styles.nslocDiff} />
                    <Text variant="secondary">File selected in both original and current scope. nSLOC changed.</Text>
                  </Row>
                  <Row spacing="s">
                    <FaPlusCircle className={styles.fileAdded} />
                    <Text variant="secondary">File added </Text>
                  </Row>
                  <Row spacing="s">
                    <FaMinusCircle className={styles.fileRemoved} />
                    <Text variant="secondary">File removed</Text>
                  </Row>
                </Column>
              </Column>
            </Box>
          </>
        ) : null}
        {scope?.map((s) => {
          const selectedNSLOC = s.files.reduce((t, f) => (t += f.selected ? f.nSLOC ?? 0 : 0), 0)
          const initialNSLOC = s.initialScope?.files.reduce((t, f) => (t += f.selected ? f.nSLOC ?? 0 : 0), 0)
          const differenceNSLOC = initialNSLOC && selectedNSLOC - initialNSLOC

          return (
            <Box shadow={false} fullWidth key={`contracts-${s.repoName}`}>
              <Column spacing="l">
                <Title variant="h2">
                  <FaGithub />
                  &nbsp;
                  {s.repoName}
                </Title>
                <Column spacing="s">
                  <Text variant="secondary" size="small" strong>
                    Original Scope from Quote
                  </Text>
                  <Row spacing="s">
                    <Text variant="secondary" size="small">
                      <strong>Files:</strong> {s.initialScope?.files.filter((f) => f.selected).length}
                    </Text>
                    <Text variant="secondary" size="small">
                      <strong>nSLOC:</strong> {initialNSLOC}
                    </Text>
                  </Row>
                </Column>
                <Column spacing="s">
                  <Text variant="secondary" size="small" strong>
                    Currently Selected Scope
                  </Text>
                  <Row spacing="s">
                    <Text variant="secondary" size="small">
                      <strong>Files:</strong> {s.files.filter((f) => f.selected).length}
                    </Text>
                    <Text variant="secondary" size="small">
                      <strong>nSLOC:</strong> {s.files.reduce((t, f) => (t += f.selected ? f.nSLOC ?? 0 : 0), 0)}
                    </Text>
                  </Row>
                </Column>

                {differenceNSLOC ? (
                  <Row spacing="s">
                    <Text variant="secondary" size="small">
                      <strong>Changes from Original Scope:</strong>
                    </Text>
                    <Text size="small" strong variant={differenceNSLOC > 0 ? "success" : "info"}>
                      {`${differenceNSLOC > 0 ? "+" : ""}${differenceNSLOC}`} nSLOC
                    </Text>
                  </Row>
                ) : null}
                <RepositoryContractsSelector
                  tree={convertToTree2(
                    s.files.map((f) => ({
                      filepath: f.filePath,
                      nsloc: f.nSLOC ?? 0,
                    })) ?? []
                  )}
                  onPathSelected={(paths) => handlePathSelected(s.repoName, paths)}
                  selectedPaths={s.files.filter((f) => f.selected).map((f) => f.filePath)}
                  onSelectAll={() => handleSelectAll(s.repoName)}
                  onClearSelection={() => handleClearSelection(s.repoName)}
                  initialScope={s.initialScope}
                />
              </Column>
            </Box>
          )
        })}
        <Box shadow={false}>
          <Button onClick={() => setSubmitScopeModalOpen(true)} disabled={!selectedFiles}>
            Submit scope
          </Button>
        </Box>
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
        {submitScopeModalOpen && (
          <SubmitScopeModal dashboardID={dashboardID ?? ""} onClose={() => setSubmitScopeModalOpen(false)} />
        )}
      </Column>
    </LoadingContainer>
  )
}
