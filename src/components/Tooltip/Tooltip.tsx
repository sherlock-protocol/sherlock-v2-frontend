import React, { PropsWithChildren } from "react"
import cx from "classnames"

import styles from "./Tooltip.module.scss"

type Props = {
  parent: React.ReactElement
  className?: string
}

export const Tooltip: React.FC<PropsWithChildren<Props>> = ({ children, parent, className }) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [x, setX] = React.useState<number | null>(null)
  const [y, setY] = React.useState<number | null>(null)

  const onMouseEnter = (e: React.MouseEvent) => {
    setX(e.nativeEvent.clientX)
    setY(e.nativeEvent.clientY)
    setIsVisible(true)
  }

  const onMouseLeave = (e: React.MouseEvent) => {
    setIsVisible(false)
  }

  return (
    <div className={cx(styles.container, className)} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
      {parent}
      {isVisible && (
        <div
          className={styles.tooltip}
          style={{
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 1000,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
