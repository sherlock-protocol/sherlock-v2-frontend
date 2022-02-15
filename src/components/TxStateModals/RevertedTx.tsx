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

const RevertedTx: React.FC<Props> = ({ hash }) => {
  return (
    <Modal closeable>
      <h1 className={styles.statusMessage}>Transaction was reverted.</h1>
      <h2 className={styles.explanationMessage}>
        For some reason, the transaction did not make it's way on the blockchain.
      </h2>
      <h2 className={styles.explanationMessage}>Check the transaction logs for any clues on what happened.</h2>
      {hash && <TxHash hash={hash} />}
    </Modal>
  )
}

export default RevertedTx
