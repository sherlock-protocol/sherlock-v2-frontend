import { DateTime } from "luxon"
import { useCallback, useEffect, useState } from "react"
import { FaClipboardList, FaFastForward, FaPlus, FaEdit, FaRegListAlt, FaUsers } from "react-icons/fa"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Table, THead, Tr, Th, TBody, Td } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { ContestsListItem, useAdminContests } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"
import { ConfirmContestActionModal } from "./ConfirmContestActionModal"
import { CreateContestModal } from "./CreateContestModal"
import { ContestScopeModal } from "./ContestScopeModal"
import { UpdateContestModal } from "./UpdateContestModal"
import { TelegramBotIndicator } from "./TelegramBotIndicator"
import { GenerateReportSuccessModal } from "./GenerateReportSuccessModal"
import { useAdminGenerateReport } from "../../../hooks/api/admin/useGenerateReport"

type ContestLifeCycleStatus =
  | "WAITING_INITIAL_PAYMENT"
  | "READY_TO_SELECT_SENIOR"
  | "WAITING_FOR_SENIOR_SELECTION"
  | "READY_TO_PUBLISH"
  | "WAITING_ON_FINAL_PAYMENT"
  | "READY_TO_APPROVE_START"
  | "START_APPROVED"
  | "RUNNING"
  | "JUDGING"
  | "ESCALATING"
  | "SHERLOCK_JUDGING"
  | "FINISHED"
  | "DRAFT"
  | "FINAL_REPORT_AVAILABLE"
  | "FINAL_REPORT_AVAILABLE_TO_GENERATE"

const getCurrentStatus = (contest: ContestsListItem): ContestLifeCycleStatus => {
  if (!contest.initialPayment) return "WAITING_INITIAL_PAYMENT"
  if (!contest.leadSeniorAuditorHandle && !contest.leadSeniorSelectionMessageSentAt) return "READY_TO_SELECT_SENIOR"
  if (!contest.leadSeniorAuditorHandle) return "WAITING_FOR_SENIOR_SELECTION"
  if (!contest.adminUpcomingApproved) return "READY_TO_PUBLISH"
  if (!contest.fullPaymentComplete) return "WAITING_ON_FINAL_PAYMENT"
  if (!contest.adminStartApproved) return "READY_TO_APPROVE_START"
  if (contest.status === "CREATED") return "START_APPROVED"
  if (contest.auditReport) return "FINAL_REPORT_AVAILABLE"
  if (contest.finalReportAvailable) return "FINAL_REPORT_AVAILABLE_TO_GENERATE"

  return contest.status
}

const getForcedStatus = (contest: ContestsListItem): ContestLifeCycleStatus | undefined => {
  const currentStatus = getCurrentStatus(contest)

  switch (currentStatus) {
    case "WAITING_INITIAL_PAYMENT":
      if (!contest.leadSeniorAuditorHandle && !contest.leadSeniorSelectionMessageSentAt) return "READY_TO_SELECT_SENIOR"
      if (!contest.adminUpcomingApproved) return "READY_TO_PUBLISH"
      if (!contest.adminStartApproved) return "READY_TO_APPROVE_START"
      break
    case "READY_TO_SELECT_SENIOR":
    case "WAITING_FOR_SENIOR_SELECTION":
      return "READY_TO_PUBLISH"
    case "WAITING_ON_FINAL_PAYMENT":
      return "READY_TO_APPROVE_START"
  }
}

export type ContestAction = "START_SENIOR_SELECTION" | "PUBLISH" | "APPROVE_START"

type ConfirmationModal = {
  contestIndex: number
  action: ContestAction
}

export const AdminContestsListActive = () => {
  const { data: contests, isLoading } = useAdminContests("active")
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal | undefined>()
  const [createContestModalOpen, setCreateContestModalOpen] = useState(false)
  const [updateContestIndex, setUpdateContextIndex] = useState<number | undefined>()
  const [scopeModal, setScopeModal] = useState<number | undefined>()
  const [forceActionRowIndex, setForceActionRowIndex] = useState<number | undefined>()
  const [reportGeneratedModalVisible, setReportGenerateModalVisible] = useState<number | undefined>()
  const {
    generateReport,
    isLoading: generateReportIsLoading,
    isSuccess,
    reset,
    variables,
    data: reportURL,
  } = useAdminGenerateReport()

  useEffect(() => {
    if (isSuccess) {
      const index = contests?.findIndex((c) => c.id === variables?.contestID)
      setReportGenerateModalVisible(index)
      console.log("undef")
    } else {
      setReportGenerateModalVisible(undefined)
      console.log("undef")
    }
  }, [isSuccess, setReportGenerateModalVisible, variables, contests])

  const handleActionClick = useCallback(
    (contestIndex: number, action: ContestAction) => {
      setConfirmationModal({
        contestIndex,
        action,
      })
    },
    [setConfirmationModal]
  )

  const handleConfirmationModalClose = useCallback(
    (confirmed: boolean) => {
      if (confirmed) {
        setForceActionRowIndex(undefined)
      }

      setConfirmationModal(undefined)
    },
    [setConfirmationModal]
  )

  const handleScopeModalClose = useCallback(() => {
    setScopeModal(undefined)
  }, [setScopeModal])

  const handleForceActionClick = useCallback((index: number) => {
    setForceActionRowIndex((i) => {
      if (i === undefined) return index

      return i === index ? undefined : index
    })
  }, [])

  const handleModalClose = useCallback(() => {
    console.log("close")
    reset()
    setReportGenerateModalVisible(undefined)
  }, [reset])

  const handleGenerateReportClick = useCallback(
    (index: number) => {
      if (!contests) return

      const contest = contests[index]
      generateReport({ contestID: contest.id })
    },
    [generateReport, contests]
  )

  const handleViewReportClick = useCallback(
    (index: number) => {
      if (!contests) return

      setReportGenerateModalVisible(index)

      console.log(contests[index])
    },
    [contests, setReportGenerateModalVisible]
  )

  const renderContestAction = useCallback(
    (contestIndex: number) => {
      if (!contests) return null

      const contest = contests[contestIndex]
      const forced = forceActionRowIndex === contestIndex
      const status = forced ? getForcedStatus(contest) : getCurrentStatus(contest)

      if (status === "READY_TO_SELECT_SENIOR")
        return (
          <Button
            onClick={() => handleActionClick(contestIndex, "START_SENIOR_SELECTION")}
            variant={forceActionRowIndex === contestIndex ? "alternate" : "primary"}
            fullWidth
          >
            Select senior
          </Button>
        )
      if (status === "READY_TO_PUBLISH")
        return (
          <Button
            onClick={() => handleActionClick(contestIndex, "PUBLISH")}
            variant={forceActionRowIndex === contestIndex ? "alternate" : "primary"}
            fullWidth
          >
            Publish
          </Button>
        )
      if (status === "READY_TO_APPROVE_START")
        return (
          <Button
            size="normal"
            variant={forceActionRowIndex === contestIndex ? "alternate" : "primary"}
            onClick={() => handleActionClick(contestIndex, "APPROVE_START")}
            fullWidth
          >
            Approve Start
          </Button>
        )

      if (status === "FINAL_REPORT_AVAILABLE_TO_GENERATE")
        return (
          <Button
            size="normal"
            variant={forceActionRowIndex === contestIndex ? "alternate" : "primary"}
            onClick={() => handleGenerateReportClick(contestIndex)}
            fullWidth
          >
            Generate Report
          </Button>
        )

      if (status === "FINAL_REPORT_AVAILABLE")
        return <Button onClick={() => handleViewReportClick(contestIndex)}>View report</Button>

      return (
        <Button variant="secondary" disabled fullWidth>
          -
        </Button>
      )
    },
    [contests, handleActionClick, forceActionRowIndex, handleGenerateReportClick, handleViewReportClick]
  )

  const renderContestState = useCallback(
    (contestIndex: number) => {
      if (!contests) return null

      const contest = contests[contestIndex]
      const status = getCurrentStatus(contest)

      if (status === "WAITING_INITIAL_PAYMENT") {
        return <Text variant="secondary">Waiting on initial payment</Text>
      }

      if (status === "READY_TO_SELECT_SENIOR") {
        return <Text variant="secondary">No Lead Senior Watson selected</Text>
      }

      if (status === "WAITING_FOR_SENIOR_SELECTION") {
        const timeLeft = DateTime.fromSeconds(contest.leadSeniorSelectionDate).diffNow(["days", "hours"])
        return (
          <Column spacing="s">
            <Text variant="secondary">Lead Senior Watson selection in progress</Text>
            <Text variant="secondary" size="small">
              {`Time left: ${timeLeft.toHuman({ maximumFractionDigits: 0 })}`}
            </Text>
          </Column>
        )
      }

      if (status === "READY_TO_PUBLISH") {
        return <Text variant="secondary">Ready to publish</Text>
      }

      if (status === "WAITING_ON_FINAL_PAYMENT") {
        return <Text variant="secondary">Waiting on full payment</Text>
      }

      if (status === "READY_TO_APPROVE_START") {
        return <Text variant="secondary">Ready to approve start</Text>
      }

      if (status === "START_APPROVED") {
        return (
          <Row spacing="xs">
            <Text variant="secondary">Contest approved to start on </Text>
            <Text variant="secondary" strong>
              {DateTime.fromSeconds(contest.startDate).toLocaleString(DateTime.DATE_MED)}
            </Text>
          </Row>
        )
      }

      if (status === "RUNNING") {
        return (
          <Text variant="secondary" strong>
            Running
          </Text>
        )
      }

      if (status === "ESCALATING") {
        return (
          <Text variant="secondary" strong>
            Escalations Open
          </Text>
        )
      }

      if (status === "JUDGING") {
        return (
          <Text variant="secondary" strong>
            Judging Contest
          </Text>
        )
      }

      if (status === "SHERLOCK_JUDGING") {
        return (
          <Text variant="secondary" strong>
            Sherlock Judging
          </Text>
        )
      }

      if (status === "FINISHED") {
        return (
          <Text variant="secondary" strong>
            Finished
          </Text>
        )
      }
    },
    [contests]
  )

  return (
    <LoadingContainer loading={isLoading || generateReportIsLoading}>
      <Column spacing="l">
        <Box shadow={false} fullWidth>
          <Row alignment="center">
            <Button variant="alternate" onClick={() => setCreateContestModalOpen(true)}>
              <FaPlus />
              &nbsp;Create contest
            </Button>
          </Row>
        </Box>
        <Box shadow={false} fullWidth>
          <Title>CONTESTS</Title>
          <Table selectable={false} className={styles.contestsTable}>
            <THead>
              <Tr>
                <Th>
                  <Text>ID</Text>
                </Th>
                <Th>
                  <Text>Contest</Text>
                </Th>
                <Th></Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </THead>
            <TBody>
              {contests?.map((c, index) => {
                const forceStatus = getForcedStatus(c)

                return (
                  <Tr>
                    <Td>{c.id}</Td>
                    <Td>
                      <Row spacing="l" alignment={["start", "center"]}>
                        <img src={c.logoURL} className={styles.logo} alt={c.title} />
                        <Column spacing="xs">
                          <Text strong>{c.title}</Text>
                          <Text size="small" variant="secondary">
                            Starts {DateTime.fromSeconds(c.startDate).toFormat("LLLL d - t")}
                          </Text>
                          <TelegramBotIndicator contest={c} />
                        </Column>
                      </Row>
                    </Td>
                    <Td>
                      <Row spacing="s">
                        <Button
                          size="small"
                          variant="secondary"
                          disabled={!c.dashboardID}
                          onClick={() => window.open(`/dashboard/${c.dashboardID}`)}
                        >
                          <FaClipboardList />
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => window.open(`https://audits.sherlock.xyz/admin/contests/${c.id}/watsons`)}
                        >
                          <FaUsers />
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          disabled={c.status !== "CREATED"}
                          onClick={() => setUpdateContextIndex(index)}
                        >
                          <FaEdit />
                        </Button>
                        <Button size="small" variant="secondary" onClick={() => setScopeModal(c.id)}>
                          <FaRegListAlt />
                        </Button>
                      </Row>
                    </Td>
                    <Td>
                      <Row spacing="s" alignment={["start", "center"]}>
                        {renderContestState(index)}
                        {forceStatus && (
                          <Button
                            size="small"
                            variant={forceActionRowIndex === index ? "alternate" : "secondary"}
                            onClick={() => handleForceActionClick(index)}
                          >
                            <FaFastForward />
                          </Button>
                        )}
                      </Row>
                    </Td>
                    <Td>{renderContestAction(index)}</Td>
                  </Tr>
                )
              })}
            </TBody>
          </Table>
          {confirmationModal && contests && (
            <ConfirmContestActionModal
              contest={contests[confirmationModal.contestIndex]}
              action={confirmationModal.action}
              onClose={handleConfirmationModalClose}
              force={forceActionRowIndex === confirmationModal.contestIndex}
            />
          )}
          {updateContestIndex !== undefined && contests && (
            <UpdateContestModal
              onClose={() => setUpdateContextIndex(undefined)}
              contest={contests[updateContestIndex]}
            />
          )}
          {createContestModalOpen && <CreateContestModal onClose={() => setCreateContestModalOpen(false)} />}
          {scopeModal && <ContestScopeModal contestID={scopeModal} onClose={handleScopeModalClose} />}
        </Box>
      </Column>
      {(reportGeneratedModalVisible === 0 || !!reportGeneratedModalVisible) && contests && (
        <GenerateReportSuccessModal
          contest={contests[reportGeneratedModalVisible]}
          report={reportURL}
          onClose={handleModalClose}
        />
      )}
    </LoadingContainer>
  )
}
