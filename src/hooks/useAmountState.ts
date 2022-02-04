import { BigNumber, ethers } from "ethers"
import React from "react"
import { escapeRegExp } from "../utils/format"

/**
 * Regex for testing the amount against
 */
const amountRegex = /^\d*(?:\\[.])?\d*$/

/**
 */

/**
 * React Hook for storing a validated and sanitized
 * currency input amount.
 *
 * @param decimals Number of decimals units to be used when parsing as BigNumber
 */
const useAmountState = (
  decimals: number
): [string, BigNumber | undefined, (value: string) => void, (value: BigNumber) => void] => {
  const [amount, setAmount] = React.useState("")
  const [amountBN, setAmountBN] = React.useState<BigNumber>()

  /**
   * Validate and set a new amount
   */
  const handleSetAmount = React.useCallback(
    (value: string) => {
      // Replace commas with periods
      const sanitizedValue = value.replace(/,/g, ".")

      // Test the inputted amount for expected format
      if (sanitizedValue === "" || amountRegex.test(escapeRegExp(sanitizedValue))) {
        setAmount(sanitizedValue)

        try {
          setAmountBN(ethers.utils.parseUnits(value, decimals))
        } catch {
          setAmountBN(undefined)
        }
      }
    },
    [decimals]
  )

  /**
   * Set BigNumber amount and format it
   */
  const handleSetAmountBN = React.useCallback(
    (value: BigNumber) => {
      setAmountBN(value)
      setAmount(ethers.utils.formatUnits(value, decimals))
    },
    [decimals]
  )

  return [amount, amountBN, handleSetAmount, handleSetAmountBN]
}

export default useAmountState
