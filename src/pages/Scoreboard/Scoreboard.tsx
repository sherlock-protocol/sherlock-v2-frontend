import React, { useState } from "react"
import { FaCrown } from "react-icons/fa"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Table, TBody, Td, Th, THead, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { SeniorWatsonModal } from "./SeniorWatsonModal"
import { useScoreboard } from "../../hooks/api/contests"

import styles from "./Scoreboard.module.scss"
import { commify } from "../../utils/units"

export const Scoreboard: React.FC = () => {
  const [seniorWatsonModalOpen, setSeniorWatsonModalOpen] = useState(false)

  const { data: scoreboard } = useScoreboard()

  if (!scoreboard) return null

  return (
    <>
      <Box>
        <Column className={styles.scoreboardTable}>
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
              {scoreboard.map((s, index) => (
                <Tr>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Row spacing="l">
                      <Text>{s.handle}</Text>
                      <Text className={styles.highlight}>
                        {s.senior && <FaCrown onClick={() => setSeniorWatsonModalOpen(true)} title="Senior Watson" />}
                      </Text>
                    </Row>
                  </Td>
                  <Td>
                    <Text variant="mono" alignment="center" strong>
                      {s.score >= 1 ? s.score.toFixed(0) : "<1"}
                    </Text>
                  </Td>
                  <Td>
                    <Text alignment="center">{s.contestDays}</Text>
                  </Td>
                  <Td>
                    <Text alignment="center">{`${commify(s.payouts)}`}</Text>
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
