import React, { useCallback, useEffect } from "react"
import { BigNumber, ethers } from "ethers"

import styles from "./Input.module.scss"
import useAmountState from "../../hooks/useAmountState"

type InputToken = "SHER" | "USDC"

export type InputProps = {
  /**
   * onChange event handler
   */
  onChange?: (value: BigNumber | undefined) => void

  /**
   * Token
   */
  token: InputToken

  /**
   * Placeholder
   */
  placeholder?: string

  /**
   * Input value (if controlled input)
   */
  value?: string
}

export const decimalsByToken: Record<InputToken, number> = {
  SHER: 18,
  USDC: 6,
}

const decommify = (value: string) => value.replaceAll(",", "")

export const Input: React.FC<InputProps> = ({ onChange, token, placeholder, value }) => {
  const [amount, amountBN, setAmount] = useAmountState(decimalsByToken[token])

  useEffect(() => {
    onChange && onChange(amountBN)
  }, [amountBN, onChange])

  useEffect(() => {
    if (value) {
      setAmount(value)
    }
  }, [value, setAmount])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(decommify(e.target.value))
    },
    [setAmount]
  )

  const displayPlaceholder = placeholder && (amount === "" || amount === "0")

  return (
    <div className={styles.inputContainer}>
      {displayPlaceholder && <span className={styles.placeholder}>{placeholder}</span>}
      <input className={styles.input} value={ethers.utils.commify(amount)} onChange={handleInputChange} />
    </div>
  )
}
