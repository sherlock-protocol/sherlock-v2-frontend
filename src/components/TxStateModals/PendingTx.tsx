import React from "react"
import { Column } from "../Layout"
import Loading from "../Loading/Loading"
import Modal from "../Modal/Modal"
import { Text } from "../Text"
import TxHash from "./TxHash"

interface Props {
  /**
   * Transaction hash
   */
  hash?: string
}

const PendingTx: React.FC<Props> = ({ hash }) => {
  return (
    <Modal>
      <Column spacing="m" alignment="center">
        <Loading variant="Layer" label="Transaction approved and pending" />
        <Text>Waiting for the transaction to make it's way on the blockchain.</Text>
        {hash && <TxHash hash={hash} />}
      </Column>
    </Modal>
  )
}

export default PendingTx
