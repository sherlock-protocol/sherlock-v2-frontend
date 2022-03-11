import React from "react"
import { Box } from "../Box"
import { Title } from "../Title"
import appStyles from "../../App.module.scss"
import styles from "./ErrorBoundary.module.scss"
import { Header } from "../Header"
import { Footer } from "../Footer"
import { Text } from "../Text"
import { Button } from "../Button/Button"
import { Column } from "../Layout"

type Props = {
  error: Error
  componentStack: string | null
  eventId: string | null
  resetError(): void
}

const ErrorBoundary: React.FC<Props> = ({ error, componentStack, eventId, resetError }) => {
  return (
    <div className={appStyles.app}>
      <div className={appStyles.noise} />
      <Header logoOnly={true} />
      <div className={appStyles.content}>
        <Box>
          <Column spacing="m">
            <Title>Oups! Encountered an error</Title>
            <Text variant="mono">{error.toString()}</Text>
            <Column className={styles.stack}>
              <pre>{componentStack}</pre>
            </Column>
            <Button onClick={resetError}>Take me back</Button>
            <Text size="tiny" className={styles.eventId}>
              Event ID: {eventId}
            </Text>
          </Column>
        </Box>
      </div>
      <Footer />
    </div>
  )
}

export default ErrorBoundary
