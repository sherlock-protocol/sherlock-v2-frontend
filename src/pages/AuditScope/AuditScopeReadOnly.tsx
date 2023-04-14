import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { useScope } from "../../hooks/api/scope/useScope"
import { Text } from "../../components/Text"
import { useProtocolDashboard } from "../../hooks/api/contests/useProtocolDashboard"
import { ScopeList } from "./ScopeList"

import styles from "./AuditScope.module.scss"
import { FaCheckCircle } from "react-icons/fa"

type Props = {
  dashboardID: string
}

export const AuditScopeReadOnly: React.FC<Props> = ({ dashboardID }) => {
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")
  const { data: scope } = useScope(dashboardID)

  return (
    <Column spacing="l" className={styles.auditScope}>
      <Box shadow={false}>
        <Column spacing="s">
          <Row spacing="xs" className={styles.completed} alignment={["start", "center"]}>
            <Title variant="h2">SCOPE</Title>
            <Text variant="alternate">
              <FaCheckCircle />
            </Text>
          </Row>
          <Row spacing="xs">
            <Text>Contracts:</Text>
            <Text strong>{scope?.reduce((t, s) => t + s.files.length, 0)}</Text>
          </Row>
          <Row spacing="xs">
            <Text>nSLOC:</Text>
            <Text strong>{scope?.reduce((t, s) => (t += s.nSLOC ?? 0), 0)}</Text>
          </Row>
        </Column>
      </Box>
      {scope && <ScopeList scope={scope} />}
    </Column>
  )
}
