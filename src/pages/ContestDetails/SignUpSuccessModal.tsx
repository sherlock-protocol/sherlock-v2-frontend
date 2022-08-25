import React from "react"

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
  return (
    <Modal closeable onClose={onClose}>
      <Column alignment={["center", "center"]} spacing="xl">
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
        <Row alignment={["center", "center"]}>
          {repo ? (
            <Text>
              We've created{" "}
              <a href={`https://github.com/${repo}`} target="__blank">
                this repo
              </a>{" "}
              for you to start submitting issues!
            </Text>
          ) : (
            <Text>Once the contest starts, we'll create a repo for you to start submitting issues.</Text>
          )}
        </Row>
        <Row>
          <Button onClick={onClose}>OK</Button>
        </Row>
      </Column>
    </Modal>
  )
}
