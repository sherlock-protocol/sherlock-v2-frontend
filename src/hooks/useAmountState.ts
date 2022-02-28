import { BigNumber, ethers } from "ethers"
import React from "react"
import { escapeRegExp } from "../utils/format"

/**
 * Regex for testing the amount against
 */
const amountRegex = /^\d*$/ // Accepts only integer numbers
// const amountRegex = /^\d*(?:\\[.])?\d*$/ // Accepts numbers with dot as decimal separator

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

      // Strip decimal separator and following digits (a.k.a. extract integer part)
      const integerPart = sanitizedValue.replace(/\.(.*?\d*)/, "")

      // Test the inputted amount for expected format
      if (integerPart === "" || amountRegex.test(escapeRegExp(integerPart))) {
        setAmount(integerPart)

        try {
          setAmountBN(ethers.utils.parseUnits(integerPart, decimals))
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
      // Extract integer part only
      const integerPart = value.sub(value.mod(10 ** decimals))

      // Even though we removed decimals, formatUnits outputs a number XXXX.0
      // We strip the useless 0 decimal.
      const formattedAmount = ethers.utils.formatUnits(integerPart, decimals)
      const strippedFormattedAmount = formattedAmount.replace(/\.(.*?\d*)/, "")

      setAmountBN(integerPart)
      setAmount(strippedFormattedAmount)
    },
    [decimals]
  )

  return [amount, amountBN, handleSetAmount, handleSetAmountBN]
}

export default useAmountState
