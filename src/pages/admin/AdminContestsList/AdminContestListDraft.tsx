import { useState } from "react"
import { FaClipboardList, FaRecycle, FaRedo, FaUndo } from "react-icons/fa"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Table, TBody, Td, Th, THead, Tr } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminContests } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"
import { ConfirmContestModal } from "./ConfirmContestModal"
import { ContestResetInitialScopeModal } from "./ContestResetInitialScopeModal"

export const AdminContestListDraft = () => {
  const { data: contests, isLoading } = useAdminContests("draft")

  const [confirmContestIndex, setConfirmContestIndex] = useState<number | undefined>()
  const [resetContestIndex, setResetContestIndex] = useState<number | undefined>()

  return (
    <LoadingContainer loading={isLoading}>
      <Column spacing="l">
        <Box shadow={false} fullWidth>
          <Title>DRAFTS</Title>
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
                        <Text strong>{c.title}</Text>
                      </Row>
                    </Td>
                    <Td>
                      <Row spacing="m">
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
                          disabled={!c.initialScopeSubmitted}
                          onClick={() => setResetContestIndex(index)}
                        >
                          <FaUndo />
                        </Button>
                      </Row>
                    </Td>
                    <Td>
                      <Text variant="secondary">
                        {c.initialScopeSubmitted ? "Initial scope submitted" : "Waiting on initial scope"}
                      </Text>
                    </Td>
                    <Td>
                      <Row>
                        <Button
                          size="normal"
                          onClick={() => setConfirmContestIndex(index)}
                          fullWidth
                          disabled={!c.initialScopeSubmitted}
                        >
                          Confirm contest
                        </Button>
                      </Row>
                    </Td>
                  </Tr>
                )
              })}
            </TBody>
          </Table>
          {confirmContestIndex !== undefined && contests && (
            <ConfirmContestModal
              onClose={() => setConfirmContestIndex(undefined)}
              contest={contests[confirmContestIndex]}
            />
          )}
          {resetContestIndex !== undefined && contests && (
            <ContestResetInitialScopeModal
              onClose={() => setResetContestIndex(undefined)}
              contest={contests[resetContestIndex]}
            />
          )}
        </Box>
      </Column>
    </LoadingContainer>
  )
}
