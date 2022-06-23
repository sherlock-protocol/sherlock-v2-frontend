import React, { PropsWithChildren } from "react"
import cx from "classnames"

import styles from "./Box.module.scss"

type Props = {
  className?: string
  shadow?: boolean
  fullWidth?: boolean
  fixedWidth?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export const Box: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  shadow = true,
  fullWidth = false,
  fixedWidth = false,
  onClick,
}) => (
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
    onClick={onClick}
  >
    {shadow && <div className={styles.shadow}></div>}
    {children}
  </div>
)
