import React from "react"
import Modal from "../Modal/Modal"
import TxHash from "./TxHash"
import { Column } from "../Layout"
import SuccessIcon from "../SuccessIcon/SuccessIcon"
import { Text } from "../Text"
import TransactionTypeMessages, { TxType } from "../../utils/txModalMessages"

interface Props {
  /**
   * Transaction type
   */
  type: TxType

  /**
   * Transaction hash
   */
  hash?: string
}

const SuccessTx: React.FC<Props> = ({ type, hash }) => {
  return (
    <Modal closeable>
      <Column spacing="m" alignment="center">
        <SuccessIcon />
        <Text strong size="large">
          {TransactionTypeMessages[type].SUCCESS.title}
        </Text>
        {TransactionTypeMessages[type].SUCCESS.messages.map((message, index) => (
          <Text key={index}>{message}</Text>
        ))}
        {hash && <TxHash hash={hash} />}
      </Column>
    </Modal>
  )
}

export default SuccessTx
