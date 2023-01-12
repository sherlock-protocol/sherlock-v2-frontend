import { useCallback, useState } from "react"
import { FaClipboardList } from "react-icons/fa"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Table, THead, Tr, Th, TBody, Td } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminApproveContest } from "../../../hooks/api/admin/useAdminApproveContest"
import { useAdminApproveStart } from "../../../hooks/api/admin/useAdminApproveStart"
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

  if (contest.status === "CREATED" && contest.fullPayment && !contest.adminStartApproved) {
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

      if (action === "PUBLISH") return <Button onClick={() => handleActionClick(contestIndex, action)}>Publish</Button>
      if (action === "APPROVE_START")
        return (
          <Button size="normal" onClick={() => handleActionClick(contestIndex, action)}>
            Approve Start
          </Button>
        )
    },
    [contests, handleActionClick]
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
              <Th></Th>
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
                    <Button
                      size="small"
                      variant="secondary"
                      disabled={!c.dashboardID}
                      onClick={() => window.open(`/dashboard/${c.dashboardID}`)}
                    >
                      <FaClipboardList />
                      &nbsp;Dashboard
                    </Button>
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
          />
        )}
      </LoadingContainer>
    </Box>
  )
}
