import { BigNumber, ethers } from "ethers"
import React from "react"
import { Button } from "../Button/Button"
import styles from "./ProtocolBalanceInput.module.scss"
import { useDebounce } from "use-debounce"
import useAmountState from "../../hooks/useAmountState"

interface Props {
  /**
   * Called when amount has changed
   */
  onChange?: (amount: BigNumber | undefined) => void

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
  const [amount, amountBN, setAmount, setAmountBN] = useAmountState(6)
  const [debouncedAmountBN] = useDebounce(amountBN, 200)

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

      setAmountBN(totalAmount)
    },
    [protocolPremium, setAmountBN]
  )

  /**
   * Propagate amountBN changes
   */
  React.useEffect(() => {
    onChange(amountBN)
  }, [amountBN, onChange])

  /**
   * Reset inputs on protocol premium change
   */
  React.useEffect(() => {
    setAmount("")
    setAmountDuration(null)
  }, [protocolPremium, setAmount])

  /**
   * Compute coverage period extension from the inputted amount
   */
  React.useEffect(() => {
    if (!debouncedAmountBN || !protocolPremium) {
      setAmountDuration(null)
    } else {
      // Catch exception from computing coverage period
      // from invalid amount numbmer (e.g. too many decimals)
      try {
        const days = debouncedAmountBN.div(protocolPremium).div(60 * 60 * 24)

        setAmountDuration(days)
      } catch {
        setAmountDuration(null)
      }
    }
  }, [debouncedAmountBN, protocolPremium])

  return (
    <div className={styles.container}>
      <div className={styles.predefinedPeriods}>
        <Button onClick={() => handleSelectPredefinedPeriod(2)}>2 weeks</Button>
        <Button onClick={() => handleSelectPredefinedPeriod(4)}>1 month</Button>
        <Button onClick={() => handleSelectPredefinedPeriod(12)}>3 months</Button>
      </div>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={usdcBalance && `max. ${ethers.utils.formatUnits(usdcBalance, 6)} USDC`}
      />
      <span>USDC</span>
      {amountDuration && <p>~{amountDuration.toString()} days</p>}
    </div>
  )
}

export default ProtocolBalanceInput
