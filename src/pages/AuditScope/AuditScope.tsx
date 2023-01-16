import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import styles from "./AuditScope.module.scss"

export const AuditScope = () => {
  return (
    <Column className={styles.container}>
      <Column className={styles.content} spacing="xl">
        <Title>Audit Scope</Title>
        <Box shadow={false} fullWidth>
          <Column spacing="s">
            <Text>Copy & paste the Github repository link(s) you would like to audit</Text>
            <Input />
            <Button>Add repo</Button>
          </Column>
        </Box>
        <Box shadow={false} fullWidth>
          <Column spacing="s">
            <Text>Select branch and commit hash</Text>
            <Row spacing="s">
              <Input value="sherlock-protocol/sherlock-v2-core" variant="small" disabled />
              <Button variant="secondary">main</Button>
              <Button variant="secondary">0x53..321</Button>
            </Row>
          </Column>
        </Box>
      </Column>
    </Column>
  )
}
