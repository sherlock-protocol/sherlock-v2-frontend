import cx from "classnames"
import { DateTime } from "luxon"
import { FaCheckCircle, FaRegCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Box } from "../../../components/Box"
import { Row } from "../../../components/Layout"
import { Table, TBody, Td, Th, THead, Tr } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useProtocolDashboard } from "../../../hooks/api/contests/useProtocolDashboard"
import { protocolDashboardRoutes } from "../../../utils/routes"

import styles from "./ProtocolDashboardSideBar.module.scss"

type TaskRoute = typeof protocolDashboardRoutes[keyof typeof protocolDashboardRoutes]

type TaskProps = {
  title: string
  dueDate?: string
  completed?: boolean
  route: TaskRoute
}

const Task: React.FC<TaskProps> = ({ title, dueDate, completed = false, route }) => {
  const navigate = useNavigate()

  return (
    <Tr
      className={cx({
        [styles.completed]: completed,
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

export const ProtocolDashboardSideBar: React.FC<Props> = ({ dashboardID }) => {
  const { data: dashboard } = useProtocolDashboard(dashboardID)

  if (!dashboard) return null

  const { contest } = dashboard

  const initialPaymentDueDate = DateTime.fromSeconds(contest.startDate).minus({ hours: 24 * 3 })
  const finalPaymentDueDate = DateTime.fromSeconds(contest.startDate).minus({ hours: 24 * 1 })

  return (
    <Box shadow={false}>
      <Title variant="h2">TASKS</Title>
      <Table>
        <THead>
          <Tr>
            <Th></Th>
            <Th>
              <Row alignment="end">
                <Text strong>DUE DATE</Text>
              </Row>
            </Th>
          </Tr>
        </THead>
        <TBody>
          <Task
            title="Submit Initial Payment"
            completed={contest.initialPaymentComplete}
            dueDate={initialPaymentDueDate.toFormat("LLL dd")}
            route={protocolDashboardRoutes.Payments}
          />
          <Task title="Define Audit Scope" completed={contest.scopeReady} route={protocolDashboardRoutes.Scope} />
          <Task title="Add Team Members" route={protocolDashboardRoutes.Team} />
          <Task
            title="Submit Final Payment"
            completed={contest.fullPaymentComplete}
            dueDate={finalPaymentDueDate.toFormat("LLL dd")}
            route={protocolDashboardRoutes.Payments}
          />
        </TBody>
      </Table>
    </Box>
  )
}
