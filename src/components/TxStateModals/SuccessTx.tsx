import React from "react"
import Modal from "../Modal/Modal"
import TxHash from "./TxHash"
import { Column } from "../Layout"
import SuccessIcon from "../SuccessIcon/SuccessIcon"
import { Text } from "../Text"

interface Props {
  /**
   * Transaction hash
   */
  hash?: string
}

const SuccessTx: React.FC<Props> = ({ hash }) => {
  return (
    <Modal closeable>
      <Column spacing="m" alignment="center">
        <SuccessIcon />
        <Text strong size="large">
          Transaction was successful!
        </Text>
        <Text>Yipeee! The transaction maade it's way on the blockchain!</Text>
        {hash && <TxHash hash={hash} />}
      </Column>
    </Modal>
  )
}

export default SuccessTx
