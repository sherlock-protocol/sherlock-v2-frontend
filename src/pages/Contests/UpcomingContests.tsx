import React, { useMemo } from "react"
import { DateTime } from "luxon"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"

import styles from "./Contests.module.scss"
import { commify } from "../../utils/units"
import { Table, TBody, Td, Th, THead, Tr } from "../../components/Table/Table"
import { Contest } from "../../hooks/api/contests"
import { FaLock } from "react-icons/fa"
import { getTotalRewards } from "../../utils/contests"

type Props = {
  contests?: Contest[]
  onContestClick?: (id: number) => void
}

export const UpcomingContests: React.FC<Props> = ({ contests, onContestClick }) => {
  const upcomingContests = useMemo(
    () => contests?.filter((c) => c.status === "CREATED").sort((a, b) => (b.id === 6 ? -1 : a.startDate - b.startDate)),
    [contests]
  )

  if (!upcomingContests || upcomingContests.length === 0) return null

  return (
    <Box shadow={false} fullWidth>
      <Title variant="h2">UPCOMING</Title>
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
              <Text alignment="center">Starts</Text>
            </Th>
            <Th>
              <Text alignment="center">Ends</Text>
            </Th>
          </Tr>
        </THead>
        <TBody>
          {upcomingContests?.map((contest) => {
            const startDate = DateTime.fromSeconds(contest.startDate)
            const endDate = DateTime.fromSeconds(contest.endDate)

            return (
              <Tr key={contest.id} onClick={() => onContestClick && onContestClick(contest.id)}>
                <Td>
                  <img src={contest.logoURL} alt={contest.title} width={80} className={styles.logo} />
                </Td>
                <Td>
                  <Column spacing="s">
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
                    </Row>
                    <Text size="small">{contest.shortDescription}</Text>
                  </Column>
                </Td>
                <Td>
                  <Column spacing="xs">
                    <Text variant="mono" strong size="large" alignment="center">
                      {contest.id === 38
                        ? `$${commify(getTotalRewards(contest))}`
                        : `${commify(getTotalRewards(contest))} USDC`}
                    </Text>
                    {contest.id === 38 && (
                      <Text variant="secondary" alignment="center" size="small">
                        Maximum Payout
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
                    <Text strong size="large">
                      {endDate.toLocaleString(DateTime.DATE_MED)}
                    </Text>
                    <Text>{endDate.toLocaleString(DateTime.TIME_24_SIMPLE)}</Text>
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
