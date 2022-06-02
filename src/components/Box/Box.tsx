import React from "react"
import cx from "classnames"

import styles from "./Box.module.scss"

type Props = {
  shadow?: boolean
  fullWidth?: boolean
  fixedWidth?: boolean
}

export const Box: React.FC<Props> = ({ children, shadow = true, fullWidth = false, fixedWidth = false }) => (
  <div
    className={cx(styles.box, {
      [styles.fullWidth]: fullWidth,
      [styles.fixedWidth]: fixedWidth,
      [styles.containsShadow]: shadow,
    })}
  >
    {shadow && <div className={styles.shadow}></div>}
    {children}
  </div>
)
