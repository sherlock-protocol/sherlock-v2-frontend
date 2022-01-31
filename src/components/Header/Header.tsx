import React from "react"
import ConnectButton from "../ConnectButton/ConnectButton"
import styles from "./Header.module.scss"

/**
 * Header component including the navigation and the wallet connection.
 */
function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.leftArea}></div>
      <div className={styles.centerArea}></div>
      <div className={styles.rightArea}>
        <ConnectButton />
      </div>
    </div>
  )
}

export default Header
