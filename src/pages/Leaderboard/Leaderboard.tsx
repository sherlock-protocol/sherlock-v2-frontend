import React, { useCallback, useMemo, useState } from "react"
import cx from "classnames"
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
import { ContestLeaderboardModal } from "../ContestDetails/ContestLeaderboardModal"
import { ContestStatus, useContests } from "../../hooks/api/contests"

const getStatusLabel = (status: ContestStatus) => {
  if (status === "ESCALATING") return "Escalations Open"
  if (status === "SHERLOCK_JUDGING") return "Sherlock Judging"
  if (status === "JUDGING") return "Judging Contest"

  return ""
}

export const Leaderboard: React.FC = () => {
  const [seniorWatsonModalOpen, setSeniorWatsonModalOpen] = useState(false)
  const [contestLeaderboardOpen, setLeaderboardContestModalOpen] = useState<number | undefined>()

  const { data: leaderboard } = useLeaderboard()
  const { data: rawContests } = useContests()

  const handleContestLeaderboardModalClose = useCallback(() => {
    setLeaderboardContestModalOpen(undefined)
  }, [setLeaderboardContestModalOpen])

  const handleContestLeaderboardModalOpen = useCallback(
    (contestID: number) => {
      setLeaderboardContestModalOpen(contestID)
    },
    [setLeaderboardContestModalOpen]
  )

  const contests = useMemo(
    () => rawContests?.filter((c) => !!c.scoreSequence).sort((a, b) => b.scoreSequence! - a.scoreSequence!),
    [rawContests]
  )

  if (!leaderboard) return null

  return (
    <Row spacing="l" className={styles.container}>
      <Column grow={1}>
        <Box shadow={false}>
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
      </Column>
      <Column className={styles.timeline}>
        <Box shadow={false}>
          <Column spacing="m">
            <Title>TIMELINE</Title>
            <Table size="small">
              <TBody>
                {contests?.map((c, index, cs) => {
                  const previousContest = index > 0 ? cs[index - 1] : undefined
                  const displayDivisor = previousContest && !previousContest.calcCompleted && c.calcCompleted

                  return (
                    <>
                      {displayDivisor ? (
                        <Tr className={styles.divisor}>
                          <Td></Td>
                        </Tr>
                      ) : null}
                      <Tr
                        className={cx({
                          [styles.pending]: !c.calcCompleted,
                        })}
                        onClick={() => c.calcCompleted && handleContestLeaderboardModalOpen(c.id)}
                      >
                        <Td>
                          <Row spacing="s" alignment={["space-between", "center"]}>
                            <Row spacing="s" alignment={["start", "center"]}>
                              <img className={styles.tableLogo} src={c.logoURL} alt={c.title} />
                              <Text strong>{c.title}</Text>
                            </Row>
                            <Text size="small" variant="secondary">
                              {c.status !== "FINISHED" ? getStatusLabel(c.status) : null}
                            </Text>
                          </Row>
                        </Td>
                      </Tr>
                    </>
                  )
                })}
              </TBody>
            </Table>
          </Column>
        </Box>
      </Column>
      {seniorWatsonModalOpen && <SeniorWatsonModal onClose={() => setSeniorWatsonModalOpen(false)} />}
      {contestLeaderboardOpen && contests && (
        <ContestLeaderboardModal
          contestID={contestLeaderboardOpen}
          title={contests[contestLeaderboardOpen].title}
          logoURL={contests[contestLeaderboardOpen].logoURL}
          onClose={handleContestLeaderboardModalClose}
        />
      )}
    </Row>
  )
}
