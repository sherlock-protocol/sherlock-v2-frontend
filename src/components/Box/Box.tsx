import React, { PropsWithChildren } from "react"
import cx from "classnames"

import styles from "./Box.module.scss"

type Props = {
  shadow?: boolean
  fullWidth?: boolean
}

export const Box: React.FC<PropsWithChildren<Props>> = ({ children, shadow = true, fullWidth = false }) => (
  <div className={cx(styles.box, { [styles.fullWidth]: fullWidth })}>
    {shadow && <div className={styles.shadow}></div>}
    {children}
  </div>
)
