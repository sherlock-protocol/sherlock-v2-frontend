import { FaCrown } from "react-icons/fa"
import { Button } from "../../components/Button"
import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"

import styles from "./Leaderboard.module.scss"

export const SeniorWatsonModal = (props: ModalProps) => {
  return (
    <Modal closeable {...props}>
      <Column className={styles.seniorWatsonModal} spacing="l">
        <Row spacing="s">
          <Title>
            <FaCrown />
          </Title>
          <Title>This auditor is a Senior Watson.</Title>
        </Row>

        <Text>
          Senior Watsons are eligible to receive guaranteed pay for competing in Sherlock contests. And they have
          additional responsibilities such as conducting the fix review.
        </Text>

        <Text variant="primary">
          Sherlock whitelisted select Senior Watsons to bootstrap the contests. But once an auditor has completed 4
          contest-weeks on the Sherlock platform, they are eligible to become a Senior Watson if they are in the top 10%
          of this leaderboard. Whitelisted Senior Watsons are also at risk of having their status removed if they fall
          outside of top 10% after 4 contest-weeks.{" "}
        </Text>

        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
      </Column>
    </Modal>
  )
}
