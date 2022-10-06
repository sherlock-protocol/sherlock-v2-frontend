import React, { useCallback } from "react"
import { FaDiscord } from "react-icons/fa"

import { Button } from "../../components/Button"
import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"

import { AuditorProfile } from "../../hooks/api/auditors/index"

type Props = ModalProps & {
  auditor: AuditorProfile
}

export const SignUpSuccessModal: React.FC<Props> = ({ auditor, onClose }) => {
  const handleJoinDiscord = useCallback(() => {
    window.open("https://discord.gg/MABEWyASkp", "__blank")
    onClose && onClose()
  }, [onClose])

  return (
    <Modal closeable onClose={onClose}>
      <Column alignment={["center", "center"]} spacing="xl">
        <Row>
          <Title>Congrats!</Title>
        </Row>
        <Row>
          <Column spacing="s" alignment={["center", "center"]}>
            <Row>
              <Text>You signed up as an auditor using the handle</Text>
            </Row>
            <Row>
              <Text strong>{auditor.handle}</Text>
            </Row>
          </Column>
        </Row>
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
