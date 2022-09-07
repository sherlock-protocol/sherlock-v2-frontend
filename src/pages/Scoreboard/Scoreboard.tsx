import React from "react"
import { Box } from "../../components/Box"
import { Column } from "../../components/Layout"
import { Table, TBody, Td, Th, THead, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"

import styles from "./Scoreboard.module.scss"

export const Scoreboard: React.FC = () => {
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
                <Text alignment="center">Points</Text>
              </Th>
            </Tr>
          </THead>
          <TBody>
            <Tr>
              <Td>1</Td>
              <Td>evert</Td>
              <Td>
                <Text variant="mono" alignment="center">
                  5
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Td>1</Td>
              <Td>rares</Td>
              <Td>
                <Text variant="mono" alignment="center">
                  5
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Td>1</Td>
              <Td>heisenberg</Td>
              <Td>
                <Text variant="mono" alignment="center">
                  5
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Td>1</Td>
              <Td>fran</Td>
              <Td>
                <Text variant="mono" alignment="center">
                  5
                </Text>
              </Td>
            </Tr>
          </TBody>
        </Table>
      </Column>
    </Box>
  )
}
