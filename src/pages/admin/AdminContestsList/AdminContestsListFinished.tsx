import { DateTime } from "luxon"
import { FaClipboardList, FaEye } from "react-icons/fa"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Table, TBody, Td, Th, THead, Tr } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminContests } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"

export const AdminContestsListFinished = () => {
  const { data: contests, isLoading } = useAdminContests("finished")

  return (
    <LoadingContainer loading={isLoading}>
      <Column spacing="l">
        <Box shadow={false} fullWidth>
          <Title>FINISHED CONTESTS</Title>
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
                <Th>Action</Th>
              </Tr>
            </THead>
            <TBody>
              {contests?.map((c, index) => (
                <Tr>
                  <Td>{c.id}</Td>
                  <Td>
                    {" "}
                    <Row spacing="l" alignment={["start", "center"]}>
                      <img src={c.logoURL} className={styles.logo} alt={c.title} />
                      <Column spacing="xs">
                        <Text strong>{c.title}</Text>
                        <Text size="small" variant="secondary">
                          Ended {DateTime.fromSeconds(c.endDate).toFormat("LLLL d, yyyy")}
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
                        disabled={!c.adminUpcomingApproved}
                        onClick={() => window.open(`/audits/contests/${c.id}`)}
                      >
                        <FaEye />
                      </Button>
                    </Row>
                  </Td>
                  <Td></Td>
                  <Td>
                    <Button>Generate report</Button>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Box>
      </Column>
    </LoadingContainer>
  )
}
