import { FaCrown, FaUsers } from "react-icons/fa"
import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { useContest } from "../../hooks/api/contests"
import { Title } from "../../components/Title"
import { Table, TBody, Td, Th, THead, Tr } from "../../components/Table/Table"
import { useContestLeaderboard } from "../../hooks/api/contests/useContestLeaderboard"
import { commify } from "../../utils/units"

import styles from "../Scoreboard/Scoreboard.module.scss"

type Props = ModalProps & {
  contestID: number
}

export const ContestLeaderboardModal: React.FC<Props> = ({ contestID, onClose }) => {
  const { data: contest } = useContest(contestID)
  const { data: leaderboard } = useContestLeaderboard(contestID)

  if (!contest) return null

  return (
    <Modal closeable onClose={onClose}>
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
                    {c.isSenior && (
                      <Text className={styles.highlight}>
                        <FaCrown title="Senior Watson" />
                      </Text>
                    )}
                  </Row>
                </Td>
                <Td>
                  <Text variant="mono" alignment="center" strong>
                    {c.score >= 1 ? c.score.toFixed(0) : "<1"}
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
    </Modal>
  )
}
