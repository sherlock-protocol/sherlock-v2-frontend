import React from "react"

import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"

type Props = ModalProps & {
  reason?: string
}

export const ErrorModal: React.FC<Props> = ({ onClose, reason }) => {
  return (
    <Modal closeable onClose={onClose}>
      <Column spacing="xl">
        <Row>
          <Title variant="h1">Something went wrong</Title>
        </Row>
        <Row>
          <Text>{reason}</Text>
        </Row>
      </Column>
    </Modal>
  )
}
