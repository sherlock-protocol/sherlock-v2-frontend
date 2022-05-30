import React, { PropsWithChildren } from "react"
import cx from "classnames"

import styles from "./Text.module.scss"

type TextSize = "tiny" | "small" | "normal" | "large" | "extra-large"

type TextVariant = "normal" | "primary" | "secondary" | "mono" | "warning"

type TextProps = {
  strong?: boolean
  size?: TextSize
  variant?: TextVariant
  className?: string
}

export const Text: React.FC<PropsWithChildren<TextProps>> = ({
  children,
  strong = false,
  variant = "normal",
  size = "normal",
  className,
}) => {
  return (
    <p
      className={cx(styles.text, className, {
        [styles.strong]: strong,
        [styles[variant]]: variant,
        [styles[size]]: size,
      })}
    >
      {children}
    </p>
  )
}
