import React from "react"
import footerShadow from "../../assets/images/footer_shadow.svg"
import styles from "./Footer.module.scss"

export const Footer: React.FC = ({ children }) => (
  <div className={styles.footer}>
    <img src={footerShadow} alt="" />
    <div className={styles.bottom}></div>
    <div className={styles.content}>{children}</div>
  </div>
)
