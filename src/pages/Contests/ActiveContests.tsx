import React, { useMemo } from "react"
import { FaClock } from "react-icons/fa"
import { DateTime } from "luxon"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"

import styles from "./Contests.module.scss"
import { commify } from "../../utils/units"
import { Table, TBody, Td, Th, THead, Tr } from "../../components/Table/Table"
import { Contest } from "../../hooks/api/contests"
import { timeLeftString } from "../../utils/dates"

type Props = {
  contests?: Contest[]
  onContestClick?: (id: number) => void
}

export const ActiveContests: React.FC<Props> = ({ contests, onContestClick }) => {
  const activeContests = useMemo(
    () => contests?.filter((c) => c.status === "RUNNING").sort((a, b) => a.endDate - b.endDate),
    [contests]
  )

  if (!activeContests || activeContests.length === 0) return null

  return (
    <Box shadow={false} fullWidth>
      <Title variant="h2">ACTIVE</Title>
      <Table>
        <THead>
          <Tr>
            <Th className={styles.logoColumn}></Th>
            <Th className={styles.contestColumn}>
              <Text>Contest</Text>
            </Th>
            <Th>
              <Text alignment="center">Prize pool</Text>
            </Th>
            <Th>
              <Text alignment="center">{`Started (${DateTime.now().offsetNameShort})`}</Text>
            </Th>
            <Th>
              <Text alignment="center">{`Ends (${DateTime.now().offsetNameShort})`}</Text>
            </Th>
          </Tr>
        </THead>
        <TBody>
          {activeContests?.map((contest) => {
            const startDate = DateTime.fromSeconds(contest.startDate)
            const endDate = DateTime.fromSeconds(contest.endDate)

            const timeLeft = endDate.diffNow(["day", "hour", "minute", "second"])
            const endingSoon = timeLeft.as("days") < 2

            return (
              <Tr key={contest.id} onClick={() => onContestClick && onContestClick(contest.id)}>
                <Td>
                  <img src={contest.logoURL} alt={contest.title} width={80} className={styles.logo} />
                </Td>
                <Td>
                  <Column spacing="s">
                    {endingSoon && (
                      <Row spacing="xs">
                        <Text variant="alternate">
                          <FaClock />
                        </Text>
                        <Text variant="alternate" strong>
                          {`Time left: ${timeLeftString(timeLeft)}`}
                        </Text>
                      </Row>
                    )}
                    <Title variant="h2">{contest.title}</Title>
                    <Text size="small">{contest.shortDescription}</Text>
                  </Column>
                </Td>
                <Td>
                  <Text variant="mono" strong size="large" alignment="center">
                    {commify(contest.prizePool + contest.leadSeniorAuditorFixedPay)} USDC
                  </Text>
                </Td>
                <Td>
                  <Column spacing="xs" alignment="center">
                    <Text strong size="large">
                      {startDate.toLocaleString(DateTime.DATE_MED)}
                    </Text>
                    <Text>{startDate.toLocaleString(DateTime.TIME_24_SIMPLE)}</Text>
                  </Column>
                </Td>
                <Td>
                  <Column spacing="xs" alignment="center">
                    <Text strong size="large" variant={endingSoon ? "alternate" : "normal"}>
                      {endDate.toLocaleString(DateTime.DATE_MED)}
                    </Text>
                    <Text variant={endingSoon ? "alternate" : "normal"}>
                      {endDate.toLocaleString(DateTime.TIME_24_SIMPLE)}
                    </Text>
                  </Column>
                </Td>
              </Tr>
            )
          })}
        </TBody>
      </Table>
    </Box>
  )
}
