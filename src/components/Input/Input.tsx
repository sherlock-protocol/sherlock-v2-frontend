import React, { useCallback, useEffect, useState } from "react"

import styles from "./Input.module.scss"

export type InputProps = {
  /**
   * onChange event handler
   */
  onChange?: (value: string) => void

  /**
   * Placeholder
   */
  placeholder?: string

  /**
   * Placeholder visibility
   */
  isPlaceholderVisible?: boolean

  /**
   * Input value (if controlled input)
   */
  value?: string

  /**
   * Disable input
   */
  disabled?: boolean
}

export const Input: React.FC<InputProps> = ({
  onChange,
  placeholder,
  value,
  isPlaceholderVisible = value === "0",
  disabled = false,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onChange && onChange(e.target.value)
    },
    [onChange]
  )

  const displayPlaceholder = placeholder && isPlaceholderVisible

  return (
    <div className={styles.inputContainer}>
      {displayPlaceholder && <span className={styles.placeholder}>{placeholder}</span>}
      <input className={styles.input} value={value} onChange={handleChange} disabled={disabled} />
    </div>
  )
}
