import { BigNumber, ethers } from "ethers"
import React from "react"
import { Button } from "../Button/Button"
import styles from "./ProtocolBalanceInput.module.scss"

interface Props {
  /**
   * Called when user wants to add balance
   */
  onAdd: (amount: BigNumber) => void

  /**
   * Called when user wants to remove balance
   */
  onRemove: (amount: BigNumber) => void

  /**
   * Protocol's per-second USDC premium
   */
  protocolPremium?: BigNumber
}

/**
 * Component that allows inputting an amount to be added/removed
 * to a given protocol's active balance.
 *
 * It allows using predefined coverage period (e.g. 2 weeks, 1 month, 3 months)
 * that are automatically translated to USDC.
 */
const ProtocolBalanceInput: React.FC<Props> = ({ onAdd, onRemove, protocolPremium }) => {
  /**
   * Amount in USDC
   */
  const [amount, setAmount] = React.useState<string>("")

  /**
   * Duration in seconds
   */
  const [amountDuration, setAmountDuration] = React.useState<number | null>(null)

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
    },
    [protocolPremium]
  )

  const handleOnAmountChanged = React.useCallback((e) => {
    setAmount(e.target.value)
  }, [])

  /**
   * Handle the add balance event
   */
  const handleAddBalance = React.useCallback(() => {
    // Check if amount is set
    if (!amount) {
      return
    }

    onAdd(BigNumber.from(ethers.utils.parseUnits(amount, 6)))
  }, [amount, onAdd])

  /**
   * Handle the remove balance event
   */
  const handleRemoveBalance = React.useCallback(() => {
    // Check if amount is set
    if (!amount) {
      return
    }

    onRemove(BigNumber.from(ethers.utils.parseUnits(amount, 6)))
  }, [amount, onRemove])

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
    // TODO: Debounce computation
    if (!amount || !protocolPremium) {
      setAmountDuration(null)
    } else {
      const amountBN = BigNumber.from(ethers.utils.parseUnits(amount, 6))
      const days = amountBN.div(protocolPremium).div(60 * 60 * 24)

      setAmountDuration(days.toNumber())
    }
  }, [amount, protocolPremium])

  return (
    <div className={styles.container}>
      <div className={styles.predefinedPeriods}>
        <Button onClick={() => handleSelectPredefinedPeriod(2)}>2 weeks</Button>
        <Button onClick={() => handleSelectPredefinedPeriod(4)}>1 month</Button>
        <Button onClick={() => handleSelectPredefinedPeriod(12)}>3 months</Button>
      </div>
      <input value={amount} onChange={handleOnAmountChanged} />
      <span>USDC</span>
      {amountDuration && <p>~{amountDuration} days</p>}
      <div>
        <Button onClick={handleAddBalance}>Add balance</Button>
      </div>
      <div>
        <Button onClick={handleRemoveBalance}>Remove balance</Button>
      </div>
    </div>
  )
}

export default ProtocolBalanceInput
