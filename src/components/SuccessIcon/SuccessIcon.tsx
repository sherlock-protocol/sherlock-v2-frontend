import React from "react"
import styles from "./SuccessIcon.module.scss"
import { FaCheck } from "react-icons/fa"

function SuccessIcon() {
  return (
    <div className={styles.container}>
      <div className={styles.square}>
        <div className={styles.iconContainer}>
          <FaCheck size={60} />
        </div>
      </div>
    </div>
  )
}

export default SuccessIcon
