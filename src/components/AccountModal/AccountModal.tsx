import React, { useCallback } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { Button } from "../Button"
import { Column } from "../Layout"
import Modal, { Props as ModalProps } from "../Modal/Modal"
import { Text } from "../Text"
import { Title } from "../Title"

type Props = ModalProps & {}

export const AccountModal: React.FC<Props> = ({ onClose, ...props }) => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const handleDisconnectClick = useCallback(() => {
    disconnect()
    onClose && onClose()
  }, [disconnect, onClose])

  return (
    <Modal closeable onClose={onClose} {...props}>
      <Column spacing="l">
        <Title>Connected account</Title>
        <Text>{address}</Text>
        <Button variant="alternate" onClick={handleDisconnectClick}>
          Disconnect
        </Button>
      </Column>
    </Modal>
  )
}
