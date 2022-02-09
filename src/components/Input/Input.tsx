import React from "react"

import styles from "./Input.module.scss"

type InputProps = {
  /**
   * onChange event handler
   */
  onChange?: React.ChangeEventHandler

  /**
   * input's value
   */
  value?: string
}

export const Input: React.FC<InputProps> = ({ onChange, value }) => {
  return <input className={styles.input} value={value} onChange={onChange} />
}
