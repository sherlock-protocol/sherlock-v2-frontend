import React, { PropsWithChildren } from "react"
import cx from "classnames"

import styles from "./Button.module.scss"

type ButtonSize = "small" | "normal"

type ButtonVariant = "primary" | "secondary" | "alternate" | "cta"

export type ButtonProps = {
  /**
   * On Click event handler
   */
  onClick?: (e: React.SyntheticEvent) => void

  /**
   * If button should not be interactible
   */
  disabled?: boolean

  /**
   * Button variant (@see ButtonVariant)
   */
  variant?: ButtonVariant

  /**
   * Button size (@see ButonSize)
   */
  size?: ButtonSize

  /**
   * Class name
   */
  className?: string
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  size = "normal",
  className,
}) => {
  return (
    <button
      className={cx(styles.button, styles[variant], styles[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.content}>{children}</div>
    </button>
  )
}
