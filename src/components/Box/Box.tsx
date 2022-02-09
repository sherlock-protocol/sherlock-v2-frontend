import React from "react"

import styles from "./Box.module.scss"

export const Box: React.FC = ({ children }) => (
  <div className={styles.box}>
    <div className={styles.shadow}></div>
    {children}
  </div>
)
