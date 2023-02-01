import { FaGithub } from "react-icons/fa"
import { useParams } from "react-router-dom"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { convertToTree } from "../../hooks/api/scope/useRepositoryContracts"
import { useScope } from "../../hooks/api/scope/useScope"
import { TreeEntry } from "./RepositoryContractsSelector"

import styles from "./AuditScope.module.scss"
import { Text } from "../../components/Text"
import { useProtocolDashboard } from "../../hooks/api/contests/useProtocolDashboard"

export const AuditScopeReadOnly = () => {
  const { dashboardID } = useParams()
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
      {scope?.map((s) => {
        const tree = convertToTree(s.files)
        const treeElements: React.ReactNode[] = []

        tree.forEach((value, key) => {
          treeElements.push(<TreeEntry key={key} name={key} tree={value} readOnly />)
        })

        return (
          <Box shadow={false} key={s.repoName}>
            <Column spacing="m">
              <Title variant="h2">
                <FaGithub />
                &nbsp;{s.repoName}
              </Title>
              <Column spacing="s" className={styles.tree}>
                <ul className={styles.directoryList}>{treeElements}</ul>
              </Column>
            </Column>
          </Box>
        )
      })}
    </Column>
  )
}
