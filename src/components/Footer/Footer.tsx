import React from "react"

import styles from "./Footer.module.scss"

export const Footer: React.FC = ({ children }) => (
  <div className={styles.footer}>
    <img
      src="https://uploads-ssl.webflow.com/6176d669c3360a6d1836d422/61cc2b6c39c94d6772972b25_Rectangle%2089%20(1).svg"
      loading="eager"
      alt=""
    />
    <div className={styles.bottom}></div>
    <div className={styles.content}>{children}</div>
  </div>
)
