import React, { useCallback } from "react"
import { FaDiscord, FaLock } from "react-icons/fa"

import { Button } from "../../components/Button"
import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { Contest } from "../../hooks/api/contests"
import { Title } from "../../components/Title"

import styles from "./ContestDetails.module.scss"

type Props = ModalProps & {
  contest: Contest
  repo?: string | null
}

export const SignUpSuccessModal: React.FC<Props> = ({ contest, onClose, repo }) => {
  const handleJoinDiscord = useCallback(() => {
    window.open("https://discord.gg/MABEWyASkp", "__blank")
    onClose && onClose()
  }, [onClose])

  return (
    <Modal closeable onClose={onClose}>
      <Column alignment={["center", "center"]} spacing="xl" className={styles.successModal}>
        <Row>
          <img src={contest.logoURL} width={80} height={80} alt={contest.title} className={styles.logo} />
        </Row>
        <Row>
          <Title>Congrats!</Title>
        </Row>
        <Row>
          <Column spacing="s" alignment={["center", "center"]}>
            <Row>
              <Text>You signed up for</Text>
            </Row>
            <Row>
              <Text strong>{contest.title}</Text>
            </Row>
          </Column>
        </Row>
        <Column alignment={["center", "center"]} spacing="m">
          {contest.private ? (
            <>
              <Text variant="alternate" strong>
                <FaLock /> PRIVATE CONTEST
              </Text>
              <Text alignment="center">
                This is a private contest. Once the contest starts, only the Top 10 auditors will be selected to
                compete.
              </Text>
            </>
          ) : repo ? (
            <Text>
              We've created{" "}
              <a href={`https://github.com/${repo}`} target="__blank">
                this repo
              </a>{" "}
              for you to start submitting issues!
            </Text>
          ) : (
            <Text alignment="center">
              Once the contest starts, we'll create a repo for you to start submitting issues.
            </Text>
          )}
        </Column>
        <Row>
          <Button fullWidth onClick={handleJoinDiscord}>
            <FaDiscord />
            <Text>Join our Discord</Text>
          </Button>
        </Row>
        <Row>
          <Text>or</Text>
        </Row>
        <Row>
          <Button variant="secondary" onClick={onClose} fullWidth>
            Continue
          </Button>
        </Row>
      </Column>
    </Modal>
  )
}
