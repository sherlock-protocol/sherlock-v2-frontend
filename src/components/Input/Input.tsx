import { BigNumber, ethers } from "ethers"
import React, { useCallback } from "react"

import styles from "./Input.module.scss"

type InputToken = "SHER" | "USDC"

type InputProps = {
  /**
   * onChange event handler
   */
  onChange?: (value: BigNumber) => void

  /**
   * input's value
   */
  value?: BigNumber

  /**
   * token
   */
  token: InputToken
}

const decimalsByToken: Record<InputToken, number> = {
  SHER: 18,
  USDC: 6,
}

export const Input: React.FC<InputProps> = ({ onChange, value, token }) => {
  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.validity.valid) return

      const valueAsBigNumber = ethers.utils.parseUnits(e.target.value, decimalsByToken[token])
      onChange && onChange(valueAsBigNumber)
    },
    [onChange]
  )

  const valueAsString = value ? ethers.utils.formatUnits(value, decimalsByToken[token]).slice(0, -2) : "0"

  return <input className={styles.input} pattern="[0-9]*" value={valueAsString} onChange={onInputChange} />
}
