import { Button } from "../../components/Button"
import { Column, Row } from "../../components/Layout"
import Modal, { Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { Contest } from "../../hooks/api/contests"

import styles from "./ContestDetails.module.scss"

type Props = ModalProps & {
  contest: Contest
  onSelectPoints: (points: boolean) => void
}

export const JoinContestSelectPointsModal: React.FC<Props> = ({ contest, onSelectPoints, ...props }) => {
  return (
    <Modal closeable {...props}>
      <Column alignment="center" spacing="xl" className={styles.successModal}>
        <Column spacing="s" alignment={["center", "center"]}>
          <Title>{`Join ${contest.title} contest`}</Title>
          <img src={contest.logoURL} className={styles.logo} width={80} height={80} alt={contest.title} />
        </Column>
        <Column spacing="xs" alignment="center">
          <Title variant="h2">How would you like to compete?</Title>
          <Text variant="secondary" size="small">
            Can be changed before the contest ends
          </Text>
        </Column>
        <Column spacing="s" alignment="center">
          <Text>
            <strong>Only USDC:</strong> Your leaderboard ranking <strong>will not be</strong> affected
          </Text>
          <Text>
            <strong>USDC + Points:</strong> Your leaderboard ranking <strong>will be</strong> affected *
          </Text>
          <Text variant="secondary" alignment="center">
            * Your ranking <strong>will be</strong> affected even if you don't submit any findings to the contest.
          </Text>
        </Column>
        <Row spacing="m">
          <Button variant="alternate" onClick={() => onSelectPoints(false)}>
            Only USDC
          </Button>
          <Button onClick={() => onSelectPoints(true)}>USDC + Points</Button>
        </Row>
      </Column>
    </Modal>
  )
}
