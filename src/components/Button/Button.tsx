import React from "react"

import styles from "./Button.module.scss"

type ButtonProps = {
  /**
   * On Click event handler
   */
  onClick: (e: React.SyntheticEvent) => void

  /**
   * If button should not be interactible
   */
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
