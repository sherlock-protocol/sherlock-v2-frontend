import React from "react"
import cx from "classnames"

import styles from "./Box.module.scss"

type Props = {
  className?: string
  shadow?: boolean
  fullWidth?: boolean
  fixedWidth?: boolean
}

export const Box: React.FC<Props> = ({ children, className, shadow = true, fullWidth = false, fixedWidth = false }) => (
  <div
    className={cx(
      styles.box,
      {
        [styles.fullWidth]: fullWidth,
        [styles.fixedWidth]: fixedWidth,
        [styles.containsShadow]: shadow,
      },
      className
    )}
  >
    {shadow && <div className={styles.shadow}></div>}
    {children}
  </div>
)
