import React from "react"
import { Button } from "../../components/Button"

import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"

import styles from "./ContestDetails.module.scss"

type Props = ModalProps & {
  reason?: string | Record<string, string | string[]>
}

function parseErrorName(errorKey: string): string | undefined {
  switch (errorKey) {
    case "handle":
      return "Handle"
    case "github_handle":
      return "Github handle"
    case "discord_handle":
      return "Discord handle"
    case "twitter_handle":
      return "Twitter handle"
    case "telegram_handle":
      return "Telegram handle"
  }
}

export const ErrorModal: React.FC<Props> = ({ onClose, reason }) => {
  console.log(reason)
  return (
    <Modal closeable onClose={onClose}>
      <Column spacing="xl">
        <Row>
          <Title variant="h1">Something went wrong</Title>
        </Row>
        <Row>
          <Column spacing="xl">
            {typeof reason === "string" && <Text>{reason}</Text>}
            {typeof reason === "object" &&
              Object.entries(reason).map(([k, v]) => (
                <Row>
                  <Column spacing="s">
                    <Title variant="h3" key={k}>
                      {parseErrorName(k)?.toLocaleUpperCase()}
                    </Title>
                    <ul className={styles.errorList}>
                      {(typeof v === "string" ? [v] : v).map((err) => (
                        <li key={err}>{err}</li>
                      ))}
                    </ul>
                  </Column>
                </Row>
              ))}
          </Column>
        </Row>
        <Row>
          <Button onClick={onClose}>Ok</Button>
        </Row>
      </Column>
    </Modal>
  )
}
