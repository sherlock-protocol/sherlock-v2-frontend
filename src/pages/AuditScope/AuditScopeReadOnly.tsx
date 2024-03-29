import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { useScope } from "../../hooks/api/scope/useScope"
import { Text } from "../../components/Text"
import { ScopeList } from "./ScopeList"

import styles from "./AuditScope.module.scss"
import { FaCheckCircle } from "react-icons/fa"

type Props = {
  dashboardID: string
}

export const AuditScopeReadOnly: React.FC<Props> = ({ dashboardID }) => {
  const { data: scope } = useScope(dashboardID)

  const submittedNSLOC =
    scope?.reduce((t, s) => t + (s.files.filter((f) => f.selected).reduce((t, f) => t + (f.nSLOC ?? 0), 0) ?? 0), 0) ??
    0

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
            <Text strong>{scope?.reduce((t, s) => t + s.files.filter((f) => f.selected).length, 0)}</Text>
          </Row>
          <Row spacing="xs">
            <Text>nSLOC:</Text>
            <Text strong>{submittedNSLOC}</Text>
          </Row>
        </Column>
      </Box>
      {scope && <ScopeList scope={scope} />}
    </Column>
  )
}
