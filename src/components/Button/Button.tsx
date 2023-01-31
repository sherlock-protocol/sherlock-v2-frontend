import React, { PropsWithChildren } from "react"
import cx from "classnames"

import styles from "./Button.module.scss"
import { Row } from "../Layout"

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

  /**
   * Icon button
   */
  icon?: boolean
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  size = "normal",
  fullWidth = false,
  className,
  icon = false,
}) => {
  return (
    <button
      className={cx(styles.button, styles[variant], styles[size], className, {
        [styles.fullWidth]: fullWidth,
        [styles.icon]: icon,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      <Row className={styles.content} spacing="xs" alignment={["center", "center"]}>
        {children}
      </Row>
    </button>
  )
}
