import { useMemo, useState } from "react"
import { FaClipboardList, FaFilter, FaTrash, FaUndo, FaUsers } from "react-icons/fa"
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
import { DeleteDraftContestModal } from "./DeleteDraftContestModal"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/Tooltip/Tooltip"
import { DateTime } from "luxon"
import { useNavigate } from "react-router-dom"

type FilterType = "ALL" | "ONLY_SCOPE_SUBMITTED" | "ONLY_SCOPE_NOT_SUBMITTED"

const FilterLabels: Record<FilterType, string> = {
  ALL: "All contests",
  ONLY_SCOPE_SUBMITTED: "Only with submitted scope",
  ONLY_SCOPE_NOT_SUBMITTED: "Only without submitted scope",
}

export const AdminContestListDraft = () => {
  const { data: contests, isLoading } = useAdminContests("draft")

  const [confirmContestIndex, setConfirmContestIndex] = useState<number | undefined>()
  const [resetContestIndex, setResetContestIndex] = useState<number | undefined>()
  const [deleteContestIndex, setDeleteContestIndex] = useState<number | undefined>()

  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL")

  const navigate = useNavigate()

  const visibleContests = useMemo(() => {
    switch (activeFilter) {
      case "ALL":
        return contests
      case "ONLY_SCOPE_SUBMITTED":
        return contests
          ?.filter((item) => item.initialScopeSubmitted)
          .sort((a, b) => (b.initialScopeSubmittedAt ?? 0) - (a.initialScopeSubmittedAt ?? 0))
      case "ONLY_SCOPE_NOT_SUBMITTED":
        return contests?.filter((item) => !item.initialScopeSubmitted)
    }
  }, [contests, activeFilter])

  return (
    <LoadingContainer loading={isLoading}>
      <Column spacing="l">
        <Box shadow={false} fullWidth>
          <Row alignment={"space-between"}>
            <Title>DRAFTS</Title>
            <Tooltip placement="bottom-start">
              <TooltipTrigger>
                <div className={styles.filterContainer}>
                  <FaFilter />
                  <span>Filter</span>
                  <div className={styles.activeFilter}>
                    <span>{FilterLabels[activeFilter]}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent padding={false}>
                <div className={styles.filtersList}>
                  {Object.entries(FilterLabels).map(([value, label]) => (
                    <div key={label} onClick={() => setActiveFilter(value as FilterType)}>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </Row>
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
              {visibleContests?.map((c, index) => {
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
                          onClick={() => navigate(`/admin/contests/${c.id}/watsons`)}
                        >
                          <FaUsers />
                        </Button>

                        <Button
                          size="small"
                          variant="secondary"
                          disabled={!c.initialScopeSubmitted}
                          onClick={() => setResetContestIndex(index)}
                        >
                          <FaUndo />
                        </Button>
                        <Button size="small" variant="secondary" onClick={() => setDeleteContestIndex(index)}>
                          <FaTrash />
                        </Button>
                      </Row>
                    </Td>
                    <Td>
                      <Text variant="secondary">
                        {c.initialScopeSubmittedAt
                          ? `Initial scope submitted at ${DateTime.fromSeconds(
                              c.initialScopeSubmittedAt
                            ).toLocaleString(DateTime.DATETIME_SHORT)}`
                          : "Waiting on initial scope"}
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
          {deleteContestIndex !== undefined && contests && (
            <DeleteDraftContestModal
              onClose={() => setDeleteContestIndex(undefined)}
              contest={contests[deleteContestIndex]}
            />
          )}
        </Box>
      </Column>
    </LoadingContainer>
  )
}
