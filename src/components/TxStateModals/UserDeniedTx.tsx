import React from "react"
import Modal from "../Modal/Modal"
import styles from "./TxStateModals.module.scss"

const UserDeniedTx: React.FC = () => {
  return (
    <Modal closeable>
      <h1 className={styles.statusMessage}>Transaction denied.</h1>
      <h2 className={styles.explanationMessage}>Wallet provider denied the transaction.</h2>
    </Modal>
  )
}

export default UserDeniedTx
