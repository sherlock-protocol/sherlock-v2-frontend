import React from "react"
import { Box } from "../../components/Box"
import { Column } from "../../components/Layout"
import { Table, TBody, Td, Th, THead, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useScoreboard } from "../../hooks/api/contests"

import styles from "./Scoreboard.module.scss"

export const Scoreboard: React.FC = () => {
  const { data: scoreboard } = useScoreboard()

  if (!scoreboard) return null

  return (
    <Box>
      <Column className={styles.scoreboardTable}>
        <Title>SCOREBOARD</Title>
        <Table>
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
                <Text alignment="right">Points</Text>
              </Th>
            </Tr>
          </THead>
          <TBody>
            {scoreboard.map((s, index) => (
              <Tr>
                <Td>{index + 1}</Td>
                <Td>
                  <Text>{s.handle}</Text>
                </Td>
                <Td>
                  <Text variant="mono" alignment="right">
                    {s.score >= 1 ? s.score.toFixed(0) : "<1"}
                  </Text>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Column>
    </Box>
  )
}
