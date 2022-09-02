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
                <Th className={styles.logoColumn}></Th>
                <Th className={styles.contestColumn}>
                  <Text>Contest</Text>
                </Th>
                <Th>
                  <Text alignment="center">Prize pool</Text>
                </Th>
                <Th>
                  <Text alignment="center">Started</Text>
                </Th>
                <Th>
                  <Text alignment="center">Ends</Text>
                </Th>
              </Tr>
            </THead>
            <TBody>
              {contests?.map((contest) => {
                const startDate = DateTime.fromSeconds(contest.startDate)
                const endDate = DateTime.fromSeconds(contest.endDate)

                return (
                  <Tr key={contest.id} onClick={() => handleContestClick(contest.id)}>
                    <Td>
                      <img src={contest.logoURL} alt={contest.title} width={80} className={styles.logo} />
                    </Td>
                    <Td>
                      <Column spacing="s">
                        <Title variant="h2">{contest.title}</Title>
                        <Text>{contest.shortDescription}</Text>
                      </Column>
                    </Td>
                    <Td>
                      <Text variant="mono" strong size="large" alignment="center">
                        {commify(contest.prizePool)} USDC
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
      </Row>
    </Column>
  )
}
