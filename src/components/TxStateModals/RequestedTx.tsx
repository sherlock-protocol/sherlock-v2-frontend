import React from "react"
import { Column } from "../Layout"
import Loading from "../Loading/Loading"
import Modal, { Props as ModalProps } from "../Modal/Modal"
import { Text } from "../Text"

type Props = ModalProps

const RequestedTx: React.FC<Props> = (props) => {
  return (
    <Modal {...props}>
      <Column spacing="m" alignment="center">
        <Loading variant="Scan" label="Transaction requested" />
        <Text>Check your wallet in order to approve the transaction.</Text>
      </Column>
    </Modal>
  )
}

export default RequestedTx
