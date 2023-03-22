import classNames from "classnames"
import React, { useCallback } from "react"

import styles from "./Input.module.scss"

type InputVariant = "regular" | "secondary" | "small"

type TextVariant = "normal" | "mono"

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
   * Text variant
   */
  textVariant?: TextVariant

  /**
   * Disable input
   */
  disabled?: boolean

  /**
   * Multiline or single line
   */
  multiline?: boolean
}

export const Input = <T extends string | number>({
  onChange,
  placeholder,
  value,
  type,
  variant = "regular",
  textVariant = "normal",
  disabled = false,
  multiline = false,
}: InputProps<T>) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback(
    (e) => {
      onChange && onChange(e.target.value as T)
    },
    [onChange]
  )

  return (
    <div className={classNames([styles.inputContainer, styles[variant]], { [styles.multiline]: multiline })}>
      {placeholder && <span className={styles.placeholder}>{placeholder}</span>}
      {multiline ? (
        <textarea
          className={classNames([styles.textarea, styles[variant], styles[textVariant]])}
          onChange={handleChange}
          disabled={disabled}
          spellCheck={false}
          value={value}
        ></textarea>
      ) : (
        <input
          className={classNames([styles.input, styles[variant], styles[textVariant]])}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          type={type}
          spellCheck={false}
        />
      )}
    </div>
  )
}
