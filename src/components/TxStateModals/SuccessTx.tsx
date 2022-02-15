import React from "react"
import Modal from "../Modal/Modal"
import styles from "./TxStateModals.module.scss"
import TxHash from "./TxHash"

interface Props {
  /**
   * Transaction hash
   */
  hash?: string
}

const SuccessTx: React.FC<Props> = ({ hash }) => {
  return (
    <Modal closeable>
      <h1 className={styles.statusMessage}>Transaction was successful!</h1>
      <h2 className={styles.explanationMessage}>Yipeee! The transaction maade it's way on the blockchain!</h2>
      {hash && <TxHash hash={hash} />}
    </Modal>
  )
}

export default SuccessTx
