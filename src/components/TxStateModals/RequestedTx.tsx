import React from "react"
import Modal from "../Modal/Modal"
import styles from "./TxStateModals.module.scss"

const RequestedTx: React.FC = () => {
  return (
    <Modal>
      <h1 className={styles.statusMessage}>Transaction requested...</h1>
      <h2 className={styles.explanationMessage}>Check your wallet in order to approve the transaction.</h2>
    </Modal>
  )
}

export default RequestedTx
