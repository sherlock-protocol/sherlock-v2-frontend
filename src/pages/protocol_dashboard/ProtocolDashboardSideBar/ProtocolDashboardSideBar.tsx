import cx from "classnames"
import { DateTime } from "luxon"
import { useCallback, useEffect, useState } from "react"
import { FaCheckCircle, FaRegCircle } from "react-icons/fa"
import { useLocation, useNavigate } from "react-router-dom"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Table, TBody, Td, Th, THead, Tr } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useFinalizeSubmission } from "../../../hooks/api/contests/useFinalizeSubmission"
import { useProtocolDashboard } from "../../../hooks/api/contests/useProtocolDashboard"
import { protocolDashboardRoutes } from "../../../utils/routes"
import { ErrorModal } from "../../ContestDetails/ErrorModal"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"

import styles from "./ProtocolDashboardSideBar.module.scss"
import { startDateIsTBD } from "../../../utils/contests"

type TaskRoute = typeof protocolDashboardRoutes[keyof typeof protocolDashboardRoutes]

type TaskProps = {
  title: string
  dueDate?: string
  completed?: boolean
  route: TaskRoute
  active?: boolean
}

const Task: React.FC<TaskProps> = ({ title, dueDate, completed = false, route, active = false }) => {
  const navigate = useNavigate()

  return (
    <Tr
      className={cx({
        [styles.completed]: completed,
        [styles.active]: active,
      })}
      onClick={() => navigate(route)}
    >
      <Td>
        <Row alignment={["start", "center"]} spacing="xs">
          {completed ? <FaCheckCircle /> : <FaRegCircle />}
          <Text strong>{title}</Text>
        </Row>
      </Td>
      <Td>
        <Row alignment="end">
          <Text>{dueDate}</Text>
        </Row>
      </Td>
    </Tr>
  )
}

type Props = {
  dashboardID: string
}

const FinalizeSubmissionModal: React.FC<ModalProps & Props> = ({ onClose, dashboardID }) => {
  const { finalizeSubmission, isSuccess, isLoading, error, reset } = useFinalizeSubmission()
  useEffect(() => {
    if (isSuccess) {
      onClose?.()
    }
  }, [isSuccess, onClose])

  const handleCancelClick = useCallback(() => {
    onClose?.()
  }, [onClose])

  const handleConfirmClick = useCallback(() => {
    finalizeSubmission({ dashboardID })
  }, [dashboardID, finalizeSubmission])

  return (
    <Modal closeable onClose={onClose}>
      <LoadingContainer loading={isLoading} label="Loading ...">
        <Column spacing="xl">
          <Title>Finalize submission</Title>
          <Text>Make sure you're done with the repo README</Text>
          <Text>Once you confirm this action, the audit repo will become read-only</Text>
          <Text variant="secondary">This action cannot be undone.</Text>
          <Row spacing="l" alignment={["center"]}>
            <Button variant="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button onClick={handleConfirmClick}>Confirm</Button>
          </Row>
        </Column>
      </LoadingContainer>
      {error && <ErrorModal reason={error?.message} onClose={() => reset()} />}
    </Modal>
  )
}

export const ProtocolDashboardSideBar: React.FC<Props> = ({ dashboardID }) => {
  const { data: dashboard } = useProtocolDashboard(dashboardID)
  const location = useLocation()
  const [finalizeSubmissionModalOpen, setFinalizeSubmissionModalOpen] = useState(false)

  if (!dashboard) return null

  const { contest } = dashboard

  const currentRoute = location.pathname.split("/").pop()
  const initialPaymentDueDate = DateTime.fromSeconds(contest.startDate).minus({ hours: 24 * 3 })
  const scopeDueDate = DateTime.fromSeconds(contest.startDate).minus({ hours: 24 * 2 })
  const teamDueDate = DateTime.fromSeconds(contest.startDate).minus({ hours: 24 * 2 })
  const finalPaymentDueDate = DateTime.fromSeconds(contest.startDate).minus({ hours: 24 * 1 })
  const startDateTBD = startDateIsTBD(contest)

  const canFinalizeSubmission =
    dashboard.contest.fullPaymentComplete && dashboard.contest.scopeReady && dashboard.contest.teamHandlesAdded

  return (
    <Box shadow={false} className={styles.tasks}>
      <Column spacing="m">
        <Table>
          <THead>
            <Tr>
              <Th>
                <Title variant="h2">TASKS</Title>
              </Th>
              <Th>
                <Row alignment="end">{!startDateIsTBD(contest) && <Text strong>DUE DATE</Text>}</Row>
              </Th>
            </Tr>
          </THead>
          <TBody>
            <Task
              title="Submit Initial Payment"
              completed={contest.initialPaymentComplete}
              dueDate={startDateTBD ? "" : initialPaymentDueDate.toFormat("LLL dd")}
              route={protocolDashboardRoutes.InitialPayment}
              active={currentRoute === protocolDashboardRoutes.InitialPayment}
            />
            <Task
              title="Define Audit Scope"
              completed={contest.scopeReady}
              dueDate={startDateTBD ? "" : scopeDueDate.toFormat("LLL dd")}
              route={protocolDashboardRoutes.Scope}
              active={currentRoute === protocolDashboardRoutes.Scope}
            />
            <Task
              title="Add Team Members"
              route={protocolDashboardRoutes.Team}
              dueDate={startDateTBD ? "" : teamDueDate.toFormat("LLL dd")}
              active={currentRoute === protocolDashboardRoutes.Team}
              completed={contest.teamHandlesAdded}
            />
            <Task
              title="Submit Final Payment"
              completed={contest.fullPaymentComplete}
              dueDate={startDateTBD ? "" : finalPaymentDueDate.toFormat("LLL dd")}
              route={protocolDashboardRoutes.FinalPayment}
              active={currentRoute === protocolDashboardRoutes.FinalPayment}
            />
          </TBody>
        </Table>
        {canFinalizeSubmission && !dashboard.contest.submissionReady && (
          <Button variant="alternate" onClick={() => setFinalizeSubmissionModalOpen(true)}>
            Finalize Submission
          </Button>
        )}
        {dashboard.contest.submissionReady && (
          <Column spacing="s" alignment="center">
            <Text variant="alternate" size="large" alignment="center" strong>
              ALL SET!
            </Text>
            <Text>The audit is scheduled to start on</Text>
            <Text strong size="large">{`${DateTime.fromSeconds(dashboard.contest.startDate).toLocaleString(
              DateTime.DATETIME_MED
            )}`}</Text>
          </Column>
        )}
        {finalizeSubmissionModalOpen && (
          <FinalizeSubmissionModal
            dashboardID={dashboardID ?? ""}
            onClose={() => setFinalizeSubmissionModalOpen(false)}
          />
        )}
      </Column>
    </Box>
  )
}
