import React from "react"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import styles from "./Countdown.module.scss"

type Props = {
  secondsLeft?: number
}

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = 60 * 60
const DAY_IN_SECONDS = 60 * 60 * 24

export const CountdownPage: React.FC<Props> = ({ secondsLeft }) => {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>()

  React.useEffect(() => {
    if (secondsLeft === null || secondsLeft === undefined) {
      return
    }

    const days = Math.floor(secondsLeft / DAY_IN_SECONDS)
    const hours = Math.floor((secondsLeft - days * DAY_IN_SECONDS) / HOUR_IN_SECONDS)
    const minutes = Math.floor((secondsLeft - days * DAY_IN_SECONDS - hours * HOUR_IN_SECONDS) / MINUTE_IN_SECONDS)
    const seconds = secondsLeft - days * DAY_IN_SECONDS - hours * HOUR_IN_SECONDS - minutes * MINUTE_IN_SECONDS

    setTimeLeft({
      days,
      hours,
      minutes,
      seconds,
    })
  }, [secondsLeft])

  return (
    <Box>
      <Column spacing="xl">
        <Column alignment="center" spacing="xl">
          <Title>Staking starts in</Title>
          <Row alignment="center" spacing="xl">
            <Column alignment="center" spacing="xs" className={styles.column}>
              <Text className={styles.value}>{timeLeft?.days?.toString().padStart(2, "0")}</Text>
              <Text className={styles.label} size="small">
                {timeLeft?.days === 1 ? "day" : "days"}
              </Text>
            </Column>
            <Column alignment="center" spacing="xs" className={styles.column}>
              <Text className={styles.value}>{timeLeft?.hours?.toString().padStart(2, "0")}</Text>
              <Text className={styles.label} size="small">
                {timeLeft?.hours === 1 ? "hour" : "hours"}
              </Text>
            </Column>
            <Column alignment="center" spacing="xs" className={styles.column}>
              <Text className={styles.value}>{timeLeft?.minutes?.toString().padStart(2, "0")}</Text>
              <Text className={styles.label} size="small">
                {timeLeft?.minutes === 1 ? "minute" : "minutes"}
              </Text>
            </Column>
            <Column alignment="center" spacing="xs" className={styles.column}>
              <Text className={styles.value}>{timeLeft?.seconds?.toString().padStart(2, "0")}</Text>
              <Text className={styles.label} size="small">
                {timeLeft?.seconds === 1 ? "second" : "seconds"}
              </Text>
            </Column>
          </Row>
          <Text size="small" className={styles.v1}>
            For the Sherlock V1, please see{" "}
            <a href="https://v1.sherlock.xyz" rel="noreferrer" target="_blank">
              https://v1.sherlock.xyz
            </a>
          </Text>
        </Column>
      </Column>
    </Box>
  )
}
