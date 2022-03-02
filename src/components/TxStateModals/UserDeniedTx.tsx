import React from "react"
import ErrorIcon from "../ErrorIcon/ErrorIcon"
import { Column } from "../Layout"
import Modal from "../Modal/Modal"
import { Text } from "../Text"

const UserDeniedTx: React.FC = () => {
  return (
    <Modal closeable>
      <Column spacing="m" alignment="center">
        <ErrorIcon />
        <Text size="large" strong>
          Transaction denied.
        </Text>
        <Text>Wallet provider denied the transaction.</Text>
      </Column>
    </Modal>
  )
}

export default UserDeniedTx
