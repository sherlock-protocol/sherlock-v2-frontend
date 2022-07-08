import React from "react"
import Modal, { Props as ModalProps } from "../Modal/Modal"
import TxHash from "./TxHash"
import { Column } from "../Layout"
import SuccessIcon from "../SuccessIcon/SuccessIcon"
import { Text } from "../Text"
import TransactionTypeMessages, { TxType } from "../../utils/txModalMessages"

type Props = {
  /**
   * Transaction type
   */
  type: TxType

  /**
   * Transaction hash
   */
  hash?: string
} & ModalProps

const SuccessTx: React.FC<Props> = ({ type, hash, ...props }) => {
  return (
    <Modal closeable {...props}>
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
