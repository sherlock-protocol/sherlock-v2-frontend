import { DateTime } from "luxon"
import { useCallback, useState } from "react"
import { FaClipboardList, FaFastForward, FaPlus, FaEdit } from "react-icons/fa"
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

type ContestLifeCycleStatus =
  | "WAITING_INITIAL_PAYMENT"
  | "READY_TO_SELECT_SENIOR"
  | "WAITING_FOR_SENIOR_SELECTION"
  | "READY_TO_PUBLISH"
  | "WAITING_ON_FINAL_PAYMENT"
  | "WAITING_ON_FINALIZE_SUBMISSION"
  | "READY_TO_APPROVE_START"
  | "START_APPROVED"
  | "RUNNING"
  | "JUDGING"
  | "ESCALATING"
  | "SHERLOCK_JUDGING"
  | "FINISHED"

const getCurrentStatus = (contest: ContestsListItem): ContestLifeCycleStatus => {
  if (!contest.initialPayment) return "WAITING_INITIAL_PAYMENT"
  if (!contest.leadSeniorAuditorHandle && !contest.leadSeniorSelectionMessageSentAt) return "READY_TO_SELECT_SENIOR"
  if (!contest.leadSeniorAuditorHandle) return "WAITING_FOR_SENIOR_SELECTION"
  if (!contest.adminUpcomingApproved) return "READY_TO_PUBLISH"
  if (!contest.fullPaymentComplete) return "WAITING_ON_FINAL_PAYMENT"
  if (!contest.submissionReady) return "WAITING_ON_FINALIZE_SUBMISSION"
  if (!contest.adminStartApproved) return "READY_TO_APPROVE_START"

  switch (contest.status) {
    case "CREATED":
      return "START_APPROVED"
    default:
      return contest.status
  }
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

      return (
        <Button variant="secondary" disabled fullWidth>
          -
        </Button>
      )
    },
    [contests, handleActionClick, forceActionRowIndex]
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
        const timeLeft = DateTime.fromSeconds(contest.leadSeniorSelectionMessageSentAt)
          .plus({ hours: 72 })
          .diffNow(["days", "hours"])
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

      if (status === "WAITING_ON_FINALIZE_SUBMISSION")
        return <Text variant="secondary">Waiting of protocol to finalize submission</Text>

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
    <LoadingContainer loading={isLoading}>
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
                          disabled={c.status !== "CREATED"}
                          onClick={() => setUpdateContextIndex(index)}
                        >
                          <FaEdit />
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
    </LoadingContainer>
  )
}
