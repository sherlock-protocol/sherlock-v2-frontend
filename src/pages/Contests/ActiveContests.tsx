import React, { useMemo } from "react"
import { FaClock, FaLock } from "react-icons/fa"
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
import { getTotalRewards } from "../../utils/contests"

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
              <Text alignment="center">Total Rewards</Text>
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
                    <Row alignment={["start", "center"]} spacing="m">
                      <Title variant="h2">{contest.title}</Title>
                      {contest.private ? (
                        <Row spacing="xs">
                          <Text variant="secondary" size="small" strong>
                            <FaLock />
                            &nbsp; PRIVATE CONTEST
                          </Text>
                        </Row>
                      ) : null}
                    </Row>{" "}
                    <Text size="small">{contest.shortDescription}</Text>
                  </Column>
                </Td>
                <Td>
                  <Column spacing="xs">
                    <Text variant="mono" strong size="large" alignment="center">
                      {commify(getTotalRewards(contest))} USDC
                    </Text>
                    {contest.id === 38 && (
                      <Text variant="secondary" alignment="center" size="small">
                        1/3 USDC and 2/3 OP tokens
                      </Text>
                    )}
                  </Column>
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
