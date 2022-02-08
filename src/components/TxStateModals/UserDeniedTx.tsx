import React from "react"
import Modal from "../Modal/Modal"

const UserDeniedTx: React.FC = () => {
  return (
    <Modal closeable>
      <p>Tx denied by user!</p>
    </Modal>
  )
}

export default UserDeniedTx
