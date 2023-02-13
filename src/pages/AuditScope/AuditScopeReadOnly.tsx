import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { useScope } from "../../hooks/api/scope/useScope"
import { Text } from "../../components/Text"
import { useProtocolDashboard } from "../../hooks/api/contests/useProtocolDashboard"
import { ScopeList } from "./ScopeList"

type Props = {
  dashboardID: string
}

export const AuditScopeReadOnly: React.FC<Props> = ({ dashboardID }) => {
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")
  const { data: scope } = useScope(dashboardID)

  return (
    <Column spacing="l">
      <Box shadow={false}>
        <Column spacing="s">
          <Title variant="h2">SCOPE</Title>
          <Row spacing="xs">
            <Text>Contracts:</Text>
            <Text strong>{scope?.reduce((t, s) => t + s.files.length, 0)}</Text>
          </Row>
          <Row spacing="xs">
            <Text>nSLOC:</Text>
            <Text strong>{protocolDashboard?.contest.linesOfCode}</Text>
          </Row>
        </Column>
      </Box>
      {scope && <ScopeList scope={scope} />}
    </Column>
  )
}
