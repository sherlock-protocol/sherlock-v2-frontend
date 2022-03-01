import React from "react"
import { Column } from "../Layout"
import Loading from "../Loading/Loading"
import Modal from "../Modal/Modal"
import { Text } from "../Text"

const RequestedTx: React.FC = () => {
  return (
    <Modal>
      <Column spacing="m" alignment="center">
        <Loading variant="Scan" label="Transaction requested" />
        <Text>Check your wallet in order to approve the transaction.</Text>
      </Column>
    </Modal>
  )
}

export default RequestedTx
