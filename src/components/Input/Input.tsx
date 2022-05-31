import classNames from "classnames"
import React, { useCallback, useEffect, useState } from "react"

import styles from "./Input.module.scss"

type InputVariant = "regular" | "small"

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
   * Input type
   */
  type?: React.HTMLInputTypeAttribute

  /**
   * Variant
   */
  variant?: InputVariant

  /**
   * Disable input
   */
  disabled?: boolean
}

export const Input: React.FC<InputProps> = ({
  onChange,
  placeholder,
  value,
  type,
  variant = "regular",
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
      <input
        className={classNames([styles.input, styles[variant]])}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        type={type}
        spellCheck={false}
      />
    </div>
  )
}
