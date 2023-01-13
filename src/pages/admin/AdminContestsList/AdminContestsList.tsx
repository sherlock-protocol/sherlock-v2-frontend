import { DateTime } from "luxon"
import { useCallback, useState } from "react"
import { FaClipboardList, FaEye } from "react-icons/fa"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Table, THead, Tr, Th, TBody, Td } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { ContestsListItem, useAdminContests } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"
import { ConfirmContestActionModal } from "./ConfirmContestActionModal"

export type ContestAction = "PUBLISH" | "APPROVE_START"

type ConfirmationModal = {
  contestIndex: number
  action: ContestAction
}

const getContestAction = (contest: ContestsListItem): ContestAction | undefined => {
  if (contest.status === "CREATED" && contest.initialPayment && !contest.adminUpcomingApproved) {
    return "PUBLISH"
  }

  if (contest.status === "CREATED" && contest.fullPayment && contest.submissionReady && !contest.adminStartApproved) {
    return "APPROVE_START"
  }
}

export const AdminContestsList = () => {
  const { data: contests, isLoading } = useAdminContests()
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal | undefined>()

  const handleActionClick = useCallback(
    (contestIndex: number, action: ContestAction) => {
      setConfirmationModal({
        contestIndex,
        action,
      })
    },
    [setConfirmationModal]
  )

  const handleConfirmationModalClose = useCallback(() => {
    setConfirmationModal(undefined)
  }, [setConfirmationModal])

  const renderContestAction = useCallback(
    (contestIndex: number) => {
      if (!contests) return null

      const contest = contests[contestIndex]
      const action = getContestAction(contest)

      if (action === "PUBLISH")
        return (
          <Button onClick={() => handleActionClick(contestIndex, action)} fullWidth>
            Publish
          </Button>
        )
      if (action === "APPROVE_START")
        return (
          <Button size="normal" onClick={() => handleActionClick(contestIndex, action)} fullWidth>
            Approve Start
          </Button>
        )

      return (
        <Button variant="secondary" disabled fullWidth>
          -
        </Button>
      )
    },
    [contests, handleActionClick]
  )

  const renderContestState = useCallback(
    (contestIndex: number) => {
      if (!contests) return null

      const contest = contests[contestIndex]

      if (contest.status === "CREATED" && !contest.initialPayment) {
        return <Text variant="secondary">Waiting on initial payment</Text>
      }

      if (contest.status === "CREATED" && !contest.adminUpcomingApproved) {
        return <Text variant="secondary">Ready to publish</Text>
      }

      if (contest.status === "CREATED" && !contest.fullPayment) {
        return <Text variant="secondary">Waiting on full payment</Text>
      }

      if (contest.status === "CREATED" && !contest.submissionReady) {
        return <Text variant="secondary">Waiting for protocol to finalize submission</Text>
      }

      if (contest.status === "CREATED" && !contest.adminStartApproved) {
        return <Text variant="secondary">Ready to approve start</Text>
      }

      if (contest.status === "CREATED") {
        return (
          <Row spacing="xs">
            <Text variant="secondary">Contest approved to start on </Text>
            <Text variant="secondary" strong>
              {DateTime.fromSeconds(contest.startDate).toLocaleString(DateTime.DATE_MED)}
            </Text>
          </Row>
        )
      }

      if (contest.status === "RUNNING") {
        return (
          <Text variant="secondary" strong>
            Running
          </Text>
        )
      }

      if (contest.status === "ESCALATING") {
        return (
          <Text variant="secondary" strong>
            Escalations Open
          </Text>
        )
      }

      if (contest.status === "JUDGING") {
        return (
          <Text variant="secondary" strong>
            Judging Contest
          </Text>
        )
      }

      if (contest.status === "SHERLOCK_JUDGING") {
        return (
          <Text variant="secondary" strong>
            Sherlock Judging
          </Text>
        )
      }

      if (contest.status === "FINISHED") {
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
    <Box shadow={false} fullWidth>
      <LoadingContainer loading={isLoading}>
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
              return (
                <Tr>
                  <Td>{c.id}</Td>
                  <Td>
                    <Row spacing="l" alignment={["start", "center"]}>
                      <img src={c.logoURL} className={styles.logo} alt={c.title} />
                      <Text>{c.title}</Text>
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
                        disabled={!c.adminUpcomingApproved}
                        onClick={() => window.open(`/audits/contests/${c.id}`)}
                      >
                        <FaEye />
                      </Button>
                    </Row>
                  </Td>
                  <Td>{renderContestState(index)}</Td>
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
          />
        )}
      </LoadingContainer>
    </Box>
  )
}
