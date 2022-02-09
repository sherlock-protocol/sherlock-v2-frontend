import React from "react"
import ConnectButton from "../ConnectButton/ConnectButton"
import styles from "./Header.module.scss"
import { ReactComponent as Logotype } from "../../assets/icons/logotype.svg"

/**
 * Header component including the navigation and the wallet connection.
 */
function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.leftArea}>
        <Logotype height={60} width={60} />
      </div>
      <div className={styles.centerArea}></div>
      <div className={styles.rightArea}>
        <ConnectButton />
      </div>
    </div>
  )
}

export default Header
