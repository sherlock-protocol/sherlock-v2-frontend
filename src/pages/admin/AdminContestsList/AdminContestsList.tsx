import { useCallback } from "react"
import { FaClipboardList } from "react-icons/fa"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Table, THead, Tr, Th, TBody, Td } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminApproveContest } from "../../../hooks/api/admin/useAdminApproveContest"
import { ContestsListItem, useAdminContests } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"

type ContestAction = "PUBLISH" | "APPROVE_START"

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
  const { approve: approveContest, isLoading: isLoadingContestApproval } = useAdminApproveContest()

  const renderContestAction = useCallback(
    (contest: ContestsListItem) => {
      const action = getContestAction(contest)

      if (action === "PUBLISH")
        return <Button onClick={() => approveContest({ contestID: contest.id })}>Publish</Button>
      if (action === "APPROVE_START")
        return (
          <Button size="normal" onClick={() => {}}>
            Approve Start
          </Button>
        )
    },
    [approveContest]
  )

  return (
    <Box shadow={false} fullWidth>
      <LoadingContainer loading={isLoading || isLoadingContestApproval}>
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
            {contests?.map((c) => {
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
                  <Td>{renderContestAction(c)}</Td>
                </Tr>
              )
            })}
          </TBody>
        </Table>
      </LoadingContainer>
    </Box>
  )
}
