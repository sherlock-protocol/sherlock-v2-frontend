import { DateTime } from "luxon"
import { useCallback, useState } from "react"
import { FaClipboardList, FaEye, FaFastForward, FaPlus } from "react-icons/fa"
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

export type ContestAction = "PUBLISH" | "APPROVE_START"

type ConfirmationModal = {
  contestIndex: number
  action: ContestAction
}

const getContestAction = (contest: ContestsListItem, force: boolean): ContestAction | undefined => {
  if (contest.status === "CREATED" && !contest.adminUpcomingApproved && (contest.initialPayment || force)) {
    return "PUBLISH"
  }

  if (
    contest.status === "CREATED" &&
    !contest.adminStartApproved &&
    ((contest.fullPayment && contest.submissionReady) || force)
  ) {
    return "APPROVE_START"
  }
}

export const AdminContestsList = () => {
  const { data: contests, isLoading } = useAdminContests()
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal | undefined>()
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
      const action = getContestAction(contest, forceActionRowIndex === contestIndex)

      if (action === "PUBLISH")
        return (
          <Button
            onClick={() => handleActionClick(contestIndex, action)}
            variant={forceActionRowIndex === contestIndex ? "alternate" : "primary"}
            fullWidth
          >
            Publish
          </Button>
        )
      if (action === "APPROVE_START")
        return (
          <Button
            size="normal"
            variant={forceActionRowIndex === contestIndex ? "alternate" : "primary"}
            onClick={() => handleActionClick(contestIndex, action)}
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

      if (contest.status === "CREATED" && !contest.adminUpcomingApproved && !contest.initialPayment) {
        return (
          <Row spacing="s" alignment={["start", "center"]}>
            <Text variant="secondary">Waiting on initial payment</Text>
            <Button
              size="small"
              variant={forceActionRowIndex === contestIndex ? "alternate" : "secondary"}
              onClick={() => handleForceActionClick(contestIndex)}
            >
              <FaFastForward />
            </Button>
          </Row>
        )
      }

      if (contest.status === "CREATED" && !contest.adminUpcomingApproved) {
        return <Text variant="secondary">Ready to publish</Text>
      }

      if (contest.status === "CREATED" && contest.adminStartApproved) {
        return (
          <Row spacing="xs">
            <Text variant="secondary">Contest approved to start on </Text>
            <Text variant="secondary" strong>
              {DateTime.fromSeconds(contest.startDate).toLocaleString(DateTime.DATE_MED)}
            </Text>
          </Row>
        )
      }

      if (contest.status === "CREATED" && !contest.fullPayment) {
        return (
          <Row spacing="s" alignment={["start", "center"]}>
            <Text variant="secondary">Waiting on full payment</Text>
            <Button
              size="small"
              variant={forceActionRowIndex === contestIndex ? "alternate" : "secondary"}
              onClick={() => handleForceActionClick(contestIndex)}
            >
              <FaFastForward />
            </Button>
          </Row>
        )
      }

      if (contest.status === "CREATED" && !contest.submissionReady) {
        return (
          <Row spacing="s" alignment={["center", "center"]}>
            <Text variant="secondary">Waiting for protocol to finalize submission</Text>
            <Button
              size="small"
              variant={forceActionRowIndex === contestIndex ? "alternate" : "secondary"}
              onClick={() => handleForceActionClick(contestIndex)}
            >
              <FaFastForward />
            </Button>
          </Row>
        )
      }

      if (contest.status === "CREATED" && !contest.adminStartApproved) {
        return <Text variant="secondary">Ready to approve start</Text>
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
    [contests, forceActionRowIndex, handleForceActionClick]
  )

  return (
    <LoadingContainer loading={isLoading}>
      <Column spacing="l">
        <Box shadow={false} fullWidth>
          <Row alignment="center">
            <Button variant="alternate">
              <FaPlus />
              &nbsp;Add contest
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
              force={forceActionRowIndex === confirmationModal.contestIndex}
            />
          )}
        </Box>
      </Column>
    </LoadingContainer>
  )
}
