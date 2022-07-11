import { BigNumber, utils } from "ethers"
import React, { useCallback, useEffect } from "react"
import cx from "classnames"
import { formatAmount } from "../../utils/format"
import { Button } from "../Button/Button"
import { Input } from "../Input"
import { InputProps } from "../Input/Input"
import { Column, Row } from "../Layout"
import { Text } from "../Text"
import styles from "./TokenInput.module.scss"
import useAmountState from "../../hooks/useAmountState"
import { commify } from "../../utils/units"

type InputToken = "SHER" | "USDC"

export type Props = Omit<InputProps<string>, "value" | "onChange"> & {
  balance?: BigNumber
  token: InputToken
  onChange: (value?: BigNumber) => void
  initialValue?: BigNumber
}

export const decimalsByToken: Record<InputToken, number> = {
  SHER: 18,
  USDC: 6,
}

const decommify = (value: string) => value.replaceAll(",", "")

export const TokenInput: React.FC<Props> = ({ balance, token, onChange, initialValue, ...props }) => {
  const [amount, amountBN, setAmount, setAmountBN] = useAmountState(decimalsByToken[token])
  const { disabled } = props

  useEffect(() => {
    onChange && onChange(amountBN)
  }, [amountBN, onChange])

  useEffect(() => {
    initialValue && setAmountBN(initialValue)
  }, [initialValue, setAmountBN])

  const handleSetMax = React.useCallback(() => {
    if (balance) {
      // Because we are passing the same BigNumber reference, the input will not update
      // on a second call with the same value.
      // We create a new BigNumber instance to workaround it
      // TODO: Find a better method to copy balance to a new instance
      setAmountBN(balance.sub(0))
    }
  }, [balance, setAmountBN])

  const handleInputChange = useCallback(
    (v: string | null) => {
      setAmount(v ? decommify(v) : "0")
    },
    [setAmount]
  )

  return (
    <>
      <Row alignment={["space-between", "center"]} spacing="xl" className={cx({ [styles.disabled]: disabled })}>
        <Column grow={1}>
          <Input value={commify(amount)} onChange={handleInputChange} {...props} />
        </Column>
        <Column grow={0}>
          <Text size="extra-large" strong>
            {token}
          </Text>
        </Column>
      </Row>
      {balance && !disabled && (
        <Row alignment={["end", "center"]} spacing="m">
          <Text className={styles.balance}>
            Balance: {formatAmount(utils.formatUnits(balance, decimalsByToken[token]))}
          </Text>
          <Button variant="primary" size="small" onClick={handleSetMax}>
            MAX
          </Button>
        </Row>
      )}
    </>
  )
}

export default TokenInput
