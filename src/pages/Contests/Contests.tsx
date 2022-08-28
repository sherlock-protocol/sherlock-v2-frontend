import React from "react"
import cx from "classnames"
import { DateTime } from "luxon"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useContests } from "../../hooks/api/contests"

import styles from "./Contests.module.scss"
import { commify } from "../../utils/units"
import { Table, TBody, Td, Th, THead, Tr } from "../../components/Table/Table"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

export const ContestsPage: React.FC<{}> = () => {
  const { data: contests } = useContests()
  const navigate = useNavigate()

  const handleContestClick = useCallback(
    (id: number) => {
      navigate(`${id}`)
    },
    [navigate]
  )

  return (
    <Column spacing="m" className={styles.container}>
      <Row>
        <Box shadow={false} fullWidth>
          <Title variant="h3">ACTIVE</Title>
          <Table>
            <THead>
              <Tr>
                <Th>
                  <Text>Contest</Text>
                </Th>
                <Th>
                  <Text>Prize pool</Text>
                </Th>
                <Th>
                  <Text>Started</Text>
                </Th>
                <Th>
                  <Text>Ends</Text>
                </Th>
              </Tr>
            </THead>
            <TBody>
              {contests?.map((contest) => (
                <Tr key={contest.id} onClick={() => handleContestClick(contest.id)}>
                  <Td>
                    <Text strong>{contest.title}</Text>
                  </Td>
                  <Td>
                    <Text variant="mono">{commify(contest.prizePool)} USDC</Text>
                  </Td>
                  <Td>{DateTime.fromSeconds(contest.startDate).toLocaleString(DateTime.DATE_MED)}</Td>
                  <Td>{DateTime.fromSeconds(contest.endDate).toLocaleString(DateTime.DATE_MED)}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Box>
      </Row>
    </Column>
  )
}
