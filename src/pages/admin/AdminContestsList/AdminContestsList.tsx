import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Table, THead, Tr, Th, TBody, Td } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminApproveContest } from "../../../hooks/api/admin/useAdminApproveContest"
import { useAdminContests } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"

export const AdminContestsList = () => {
  const { data: contests, isLoading } = useAdminContests()
  const { approve: approveContest, isLoading: isLoadingContestApproval } = useAdminApproveContest()

  return (
    <Box shadow={false} fullWidth>
      <LoadingContainer loading={isLoading || isLoadingContestApproval}>
        <Title>CONTESTS</Title>
        <Table selectable={false}>
          <THead>
            <Tr>
              <Th>
                <Text>ID</Text>
              </Th>
              <Th className={styles.contestColumn}>
                <Text>Contest</Text>
              </Th>
              <Th>
                <Text>Actions</Text>
              </Th>
            </Tr>
          </THead>
          <TBody>
            {contests?.map((c) => (
              <Tr>
                <Td>{c.id}</Td>
                <Td>
                  <Row spacing="l" alignment={["start", "center"]}>
                    <img src={c.logoURL} className={styles.logo} alt={c.title} />
                    <Text>{c.title}</Text>
                  </Row>
                </Td>
                <Td>
                  {c.adminApproved ? (
                    <Text variant="secondary" size="small" strong>
                      Approved
                    </Text>
                  ) : (
                    <Button onClick={() => approveContest({ contestID: c.id })}>Approve</Button>
                  )}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </LoadingContainer>
    </Box>
  )
}
