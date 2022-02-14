import React from "react"
import Modal from "../Modal/Modal"
import TxHash from "./TxHash"
import styles from "./TxStateModals.module.scss"

interface Props {
  /**
   * Transaction hash
   */
  hash?: string
}

const PendingTx: React.FC<Props> = ({ hash }) => {
  return (
    <Modal closeable>
      <h1 className={styles.statusMessage}>Transaction approved and pending...</h1>
      <h2 className={styles.explanationMessage}>Waiting for the transaction to make it's way on the blockchain.</h2>
      {hash && <TxHash hash={hash} />}
    </Modal>
  )
}

export default PendingTx
