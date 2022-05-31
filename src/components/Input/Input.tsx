import classNames from "classnames"
import React, { useCallback } from "react"

import styles from "./Input.module.scss"

type InputVariant = "regular" | "small"

export type InputProps<T extends string | number> = {
  /**
   * onChange event handler
   */
  onChange?: (value: T) => void

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
  value?: T

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

export const Input = <T extends string | number>({
  onChange,
  placeholder,
  value,
  type,
  variant = "regular",
  isPlaceholderVisible = value === "0" || value === 0,
  disabled = false,
}: InputProps<T>) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onChange && onChange(e.target.value as T)
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
