import React from "react"
import ErrorIcon from "../ErrorIcon/ErrorIcon"
import { Column } from "../Layout"
import Modal, { Props as ModalProps } from "../Modal/Modal"
import { Text } from "../Text"

type Props = ModalProps

const UserDeniedTx: React.FC<Props> = (props) => {
  return (
    <Modal closeable {...props}>
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
