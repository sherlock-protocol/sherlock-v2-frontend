import { BigNumber, utils } from "ethers"
import React from "react"
import { Button } from "../Button/Button"
import { useDebounce } from "use-debounce"
import { Column, Row } from "../Layout"
import TokenInput from "../TokenInput/TokenInput"
import { Text } from "../Text"

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
  const [amount, setAmount] = React.useState<BigNumber>()
  const [debouncedAmountBN] = useDebounce(amount, 200)
  const [predefinedAmount, setPredefinedAmount] = React.useState<BigNumber>()

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

      setPredefinedAmount(totalAmount)
    },
    [protocolPremium, setPredefinedAmount]
  )

  /**
   * Propagate amountBN changes
   */
  React.useEffect(() => {
    onChange(amount)
  }, [amount, onChange])

  /**
   * Reset inputs on protocol premium change
   */
  React.useEffect(() => {
    setAmount(undefined)
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
    <Column grow={1} spacing="m">
      <Row alignment="space-between" spacing="m">
        <Column grow={1}>
          <Button variant="alternate" onClick={() => handleSelectPredefinedPeriod(2)}>
            2 weeks
          </Button>
        </Column>
        <Column grow={1}>
          <Button variant="alternate" onClick={() => handleSelectPredefinedPeriod(4)}>
            1 month
          </Button>
        </Column>
        <Column grow={1}>
          <Button variant="alternate" onClick={() => handleSelectPredefinedPeriod(12)}>
            3 months
          </Button>
        </Column>
      </Row>
      <TokenInput token="USDC" onChange={setAmount} balance={usdcBalance} initialValue={predefinedAmount} />
      {amountDuration && (
        <>
          <hr />
          <Row alignment="space-between">
            <Text>Coverage added</Text>
            <Text strong>~{utils.commify(amountDuration.toString())} days</Text>
          </Row>
        </>
      )}
    </Column>
  )
}

export default ProtocolBalanceInput
