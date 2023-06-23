import { FaCrown, FaUsers } from "react-icons/fa"
import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { Table, TBody, Td, Th, THead, Tr } from "../../components/Table/Table"
import { useContestLeaderboard } from "../../hooks/api/stats/leaderboard/useContestLeaderboard"
import { commify } from "../../utils/units"

import styles from "../Leaderboard/Leaderboard.module.scss"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"

type Contest = {
  id: number
  title: string
  logoURL?: string
}

type Props = ModalProps & {
  contest: Contest
}

export const ContestLeaderboardModal: React.FC<Props> = ({ contest, onClose }) => {
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useContestLeaderboard(contest.id)

  return (
    <Modal closeable onClose={onClose}>
      <LoadingContainer loading={isLoadingLeaderboard}>
        <Column alignment={["center", "center"]} spacing="xl" className={styles.scoreboardTable}>
          <Title>{`${contest.title} Leaderboard`}</Title>

          <Row>
            <img src={contest.logoURL} width={80} height={80} alt={contest.title} className={styles.logo} />
          </Row>

          <Row spacing="s">
            <Text>Total participants:</Text>
            <Text strong>{leaderboard?.totalContestants}</Text>
          </Row>

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
                  <Text>Points</Text>
                </Th>
                <Th>
                  <Text>Payout (USDC)</Text>
                </Th>
              </Tr>
            </THead>
            <TBody>
              {leaderboard?.contestants.map((c, index) => (
                <Tr>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Row spacing="l">
                      <Text>{c.handle}</Text>
                      {c.isTeam && (
                        <Text className={styles.highlight}>
                          {" "}
                          <FaUsers title="Team" />
                        </Text>
                      )}
                      {c.isLeadSenior && (
                        <Text className={styles.highlight}>
                          <FaCrown title="Senior Watson" />
                        </Text>
                      )}
                    </Row>
                  </Td>
                  <Td>
                    <Text variant="mono" alignment="center" strong>
                      {c.score === 0 ? "-" : c.score < 1 ? "<1" : c.score.toFixed(0)}
                    </Text>
                  </Td>
                  <Td>
                    <Text alignment="center">{`${commify(c.payout, 2)}`}</Text>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Column>
      </LoadingContainer>
    </Modal>
  )
}
