import { BigNumber, ethers } from "ethers"
import React from "react"
import { escapeRegExp } from "../../utils/format"
import { Button } from "../Button/Button"
import styles from "./ProtocolBalanceInput.module.scss"
import { useDebounce } from "use-debounce"

/**
 * Regex for testing the amount against
 */
const amountRegex = /^\d*(?:\\[.])?\d*$/

interface Props {
  /**
   * Called when amount has changed
   */
  onChange?: (amount: BigNumber | null) => void

  /**
   * Protocol's per-second USDC premium
   */
  protocolPremium?: BigNumber

  /**
   * User's USDC balance
   */
  usdcBalance?: BigNumber
}

/**
 * Component that allows inputting an amount to be added/removed
 * to a given protocol's active balance.
 *
 * It allows using predefined coverage period (e.g. 2 weeks, 1 month, 3 months)
 * that are automatically translated to USDC.
 */
const ProtocolBalanceInput: React.FC<Props> = ({ onChange = () => null, protocolPremium, usdcBalance }) => {
  /**
   * Amount in USDC
   */
  const [amount, setAmount] = React.useState<string>("")
  const [debouncedAmount] = useDebounce(amount, 200)

  /**
   * Duration in seconds
   */
  const [amountDuration, setAmountDuration] = React.useState<BigNumber | null>(null)

  /**
   * Select a predefined period (in weeks) and convert to USDC
   */
  const handleSelectPredefinedPeriod = React.useCallback(
    (weeks: number) => {
      if (!protocolPremium) {
        return
      }

      // Transform period from weeks to seconds
      const seconds = weeks * 7 * 24 * 60 * 60
      const totalAmount = protocolPremium.mul(seconds)

      setAmount(ethers.utils.formatUnits(totalAmount, 6))
      onChange(totalAmount)
    },
    [protocolPremium, onChange]
  )

  const handleOnAmountChanged = React.useCallback(
    (e) => {
      // Replace commas with periods
      const value = e.target.value.replace(/,/g, ".")

      // Test the inputted amount for expected format
      if (value === "" || amountRegex.test(escapeRegExp(value))) {
        setAmount(value)

        try {
          onChange(ethers.utils.parseUnits(value, 6))
        } catch {
          onChange(null)
        }
      }
    },
    [onChange]
  )

  /**
   * Reset inputs on protocol premium change
   */
  React.useEffect(() => {
    setAmount("")
    setAmountDuration(null)
  }, [protocolPremium])

  /**
   * Compute coverage period extension from the inputted amount
   */
  React.useEffect(() => {
    if (!debouncedAmount || !protocolPremium) {
      setAmountDuration(null)
    } else {
      // Catch exception from computing coverage period
      // from invalid amount numbmer (e.g. too many decimals)
      try {
        const amountBN = BigNumber.from(ethers.utils.parseUnits(debouncedAmount, 6))
        const days = amountBN.div(protocolPremium).div(60 * 60 * 24)

        setAmountDuration(days)
      } catch {
        setAmountDuration(null)
      }
    }
  }, [debouncedAmount, protocolPremium])

  return (
    <div className={styles.container}>
      <div className={styles.predefinedPeriods}>
        <Button onClick={() => handleSelectPredefinedPeriod(2)}>2 weeks</Button>
        <Button onClick={() => handleSelectPredefinedPeriod(4)}>1 month</Button>
        <Button onClick={() => handleSelectPredefinedPeriod(12)}>3 months</Button>
      </div>
      <input
        value={amount}
        onChange={handleOnAmountChanged}
        placeholder={usdcBalance && `max. ${ethers.utils.formatUnits(usdcBalance, 6)} USDC`}
      />
      <span>USDC</span>
      {amountDuration && <p>~{amountDuration.toString()} days</p>}
    </div>
  )
}

export default ProtocolBalanceInput
