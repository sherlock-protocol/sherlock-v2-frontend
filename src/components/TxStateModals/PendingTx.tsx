import React from "react"
import TransactionTypeMessages, { TxType } from "../../utils/txModalMessages"
import { Column } from "../Layout"
import Loading from "../Loading/Loading"
import Modal, { Props as ModalProps } from "../Modal/Modal"
import { Text } from "../Text"
import TxHash from "./TxHash"

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

const PendingTx: React.FC<Props> = ({ type, hash, ...props }) => {
  return (
    <Modal {...props}>
      <Column spacing="m" alignment="center">
        <Loading variant="Layer" label={TransactionTypeMessages[type].PENDING.title} />
        {TransactionTypeMessages[type].PENDING.messages.map((message, index) => (
          <Text key={index}>{message}</Text>
        ))}
        {hash && <TxHash hash={hash} />}
      </Column>
    </Modal>
  )
}

export default PendingTx
