import React, { PropsWithChildren } from "react"
import cx from "classnames"

import styles from "./Text.module.scss"

type TextSize = "tiny" | "small" | "normal" | "large" | "extra-large"

type TextVariant = "normal" | "primary" | "secondary" | "mono" | "warning"

type TextAlignment = "center" | "left" | "right" | "justify"

type TextProps = {
  strong?: boolean
  size?: TextSize
  variant?: TextVariant
  className?: string
  alignment?: TextAlignment
}

export const Text: React.FC<PropsWithChildren<TextProps>> = ({
  children,
  strong = false,
  variant = "normal",
  size = "normal",
  className,
  alignment = "left",
}) => {
  return (
    <p
      className={cx(styles.text, className, {
        [styles.strong]: strong,
        [styles[variant]]: variant,
        [styles[size]]: size,
        [styles[alignment]]: alignment,
      })}
    >
      {children}
    </p>
  )
}
