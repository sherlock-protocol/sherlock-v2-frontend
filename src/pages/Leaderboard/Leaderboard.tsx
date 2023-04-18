import React, { useState } from "react"
import { FaCrown, FaUsers } from "react-icons/fa"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Table, TBody, Td, Th, THead, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { SeniorWatsonModal } from "./SeniorWatsonModal"

import styles from "./Leaderboard.module.scss"
import { commify } from "../../utils/units"
import { useLeaderboard } from "../../hooks/api/stats/leaderboard/useLeaderboard"

export const Leaderboard: React.FC = () => {
  const [seniorWatsonModalOpen, setSeniorWatsonModalOpen] = useState(false)

  const { data: leaderboard } = useLeaderboard()

  if (!leaderboard) return null

  return (
    <>
      <Box>
        <Column className={styles.leaderboardTable}>
          <Title>LEADERBOARD</Title>
          <Table selectable={false}>
            <THead>
              <Tr>
                <Th className={styles.positionColumn}>
                  <Text variant="mono" alignment="center">
                    #
                  </Text>
                </Th>

                <Th>
                  <Text>Auditor</Text>
                </Th>
                <Th>
                  <Text alignment="center">Points</Text>
                </Th>
                <Th>
                  <Text alignment="center">Contest days</Text>
                </Th>
                <Th>
                  <Text alignment="center">Payouts (USDC)</Text>
                </Th>
              </Tr>
            </THead>
            <TBody>
              {leaderboard.map((l, index) => (
                <Tr>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Row spacing="l">
                      <Text>{l.handle}</Text>
                      <Text className={styles.highlight}>{l.isTeam && <FaUsers title="Team" />}</Text>
                      <Text className={styles.highlight}>
                        {l.senior && <FaCrown onClick={() => setSeniorWatsonModalOpen(true)} title="Senior Watson" />}
                      </Text>
                    </Row>
                  </Td>
                  <Td>
                    <Text variant="mono" alignment="center" strong>
                      {l.score >= 1 ? l.score.toFixed(0) : "<1"}
                    </Text>
                  </Td>
                  <Td>
                    <Text alignment="center">{l.days.toFixed(1)}</Text>
                  </Td>
                  <Td>
                    <Text alignment="center">{`${commify(l.payout, 2)}`}</Text>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Column>
      </Box>
      {seniorWatsonModalOpen && <SeniorWatsonModal onClose={() => setSeniorWatsonModalOpen(false)} />}
    </>
  )
}
