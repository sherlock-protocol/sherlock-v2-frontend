import React from "react"
import cx from "classnames"

import styles from "./Button.module.scss"

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
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, variant = "primary" }) => {
  return (
    <button className={cx(styles.button, styles[variant])} onClick={onClick} disabled={disabled}>
      <div className={styles.content}>{children}</div>
    </button>
  )
}
