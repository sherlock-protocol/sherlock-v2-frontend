import React from "react"
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

  /**
   * Button grows to full possible width
   */
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  size = "normal",
  fullWidth = false,
  className,
}) => {
  return (
    <button
      className={cx(styles.button, styles[variant], styles[size], className, {
        [styles.fullWidth]: fullWidth,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.content}>{children}</div>
    </button>
  )
}
