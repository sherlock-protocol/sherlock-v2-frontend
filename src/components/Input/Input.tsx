import React, { useCallback, useState, useEffect } from "react"
import { BigNumber, ethers } from "ethers"

import styles from "./Input.module.scss"

type InputToken = "SHER" | "USDC"

type InputProps = {
  /**
   * onChange event handler
   */
  onChange?: (value: BigNumber | null) => void

  /**
   * token
   */
  token: InputToken
}

const decimalsByToken: Record<InputToken, number> = {
  SHER: 18,
  USDC: 6,
}

const decommify = (value: string) => value.replaceAll(",", "")

export const Input: React.FC<InputProps> = ({ onChange, token }) => {
  const [stringValue, setStringValue] = useState<string>("")

  useEffect(() => {
    try {
      const valueAsBigNumber = ethers.utils.parseUnits(decommify(stringValue), decimalsByToken[token])
      console.log(valueAsBigNumber.toString())
      onChange && onChange(valueAsBigNumber)
    } catch (error) {
      onChange && onChange(null)
    }
  }, [stringValue])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setStringValue(ethers.utils.commify(decommify(e.target.value)))
      } catch (error) {
        // the prev statement fails if the value is not a number, then we do nothing and input's value won't change.
      }
    },
    [setStringValue]
  )

  return <input className={styles.input} value={stringValue} onChange={handleInputChange} />
}
