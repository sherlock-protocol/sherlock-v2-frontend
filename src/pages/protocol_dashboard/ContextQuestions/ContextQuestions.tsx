import { useParams } from "react-router-dom"
import { Box } from "../../../components/Box"
import { Input } from "../../../components/Input"
import { Column } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useProtocolDashboard } from "../../../hooks/api/contests/useProtocolDashboard"
import { useContextQuestions } from "../../../hooks/api/protocols/useContextQuestions"

import styles from "./ContextQuestions.module.scss"

export const ContextQuestions = () => {
  const { dashboardID } = useParams()
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")
  const { data: contextQuestions } = useContextQuestions(dashboardID)

  return (
    <LoadingContainer>
      <Column spacing="m">
        <Box shadow={false}>
          <Column spacing="m">
            <Title variant="h2">CONTEXT Q&A</Title>
            <Text variant="secondary">
              Please answer the following questions to provide more context on the protocol.
            </Text>
            <Text variant="secondary">The answers will be visible to all Watsons in the audit contest repo.</Text>
          </Column>
        </Box>
        <Box shadow={false} className={styles.questions}>
          <Column spacing="xl">
            {contextQuestions?.map((q) => (
              <Column key={`question-${q.id}`} spacing="xs">
                <Text strong>{q.question}</Text>
                <Text variant="secondary" size="small">
                  {q.description}
                </Text>
                <Input variant="small" multiline={true} />
              </Column>
            ))}
          </Column>
        </Box>
      </Column>
    </LoadingContainer>
  )
}
