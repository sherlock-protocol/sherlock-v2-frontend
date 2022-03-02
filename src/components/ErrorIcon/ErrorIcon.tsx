import React from "react"
import styles from "./ErrorIcon.module.scss"
import { FaExclamation } from "react-icons/fa"

function ErrorIcon() {
  return (
    <div className={styles.container}>
      <div className={styles.square}>
        <div className={styles.iconContainer}>
          <FaExclamation size={50} />
        </div>
      </div>
    </div>
  )
}

export default ErrorIcon
