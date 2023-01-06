import React, { PropsWithChildren } from "react"
import cx from "classnames"

import styles from "./Box.module.scss"

type Props = {
  className?: string
  shadow?: boolean
  fullWidth?: boolean
  fixedWidth?: boolean
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
}

export const Box: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  shadow = true,
  fullWidth = false,
  fixedWidth = false,
  disabled = false,
  onClick,
}) => (
  <div
    className={cx(
      styles.box,
      {
        [styles.fullWidth]: fullWidth,
        [styles.fixedWidth]: fixedWidth,
        [styles.containsShadow]: shadow,
        [styles.disabled]: disabled,
      },
      className
    )}
    onClick={(e) => !disabled && onClick && onClick(e)}
  >
    {shadow && <div className={styles.shadow}></div>}
    {children}
  </div>
)
