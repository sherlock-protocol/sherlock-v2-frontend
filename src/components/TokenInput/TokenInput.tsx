import { BigNumber, utils } from "ethers"
import React from "react"
import cx from "classnames"
import { formatAmount } from "../../utils/format"
import { Button } from "../Button/Button"
import { Input } from "../Input"
import { decimalsByToken, InputProps } from "../Input/Input"
import { Column, Row } from "../Layout"
import { Text } from "../Text"
import styles from "./TokenInput.module.scss"

type Props = Omit<InputProps, "value"> & {
  balance?: BigNumber
  value?: BigNumber
}

const TokenInput: React.FC<Props> = ({ balance, value, ...props }) => {
  const [controlledValue, setControlledValue] = React.useState<BigNumber>()
  const { disabled } = props

  const handleSetMax = React.useCallback(() => {
    if (balance) {
      // Because we are passing the same BigNumber reference, the input will not update
      // on a second call with the same value.
      // We create a new BigNumber instance to workaround it
      // TODO: Find a better method to copy balance to a new instance
      setControlledValue(balance?.sub(0))
    }
  }, [balance])

  React.useEffect(() => {
    if (value) {
      setControlledValue(value)
    }
  }, [value])

  return (
    <>
      <Row alignment={["space-between", "center"]} spacing="xl" className={cx({ [styles.disabled]: disabled })}>
        <Column grow={1}>
          <Input value={controlledValue} {...props} />
        </Column>
        <Column grow={0}>
          <Text size="extra-large" strong>
            {props.token}
          </Text>
        </Column>
      </Row>
      {balance && (
        <Row alignment={["end", "center"]} spacing="m">
          <Text className={styles.balance}>
            Balance: {formatAmount(utils.formatUnits(balance, decimalsByToken[props.token]))}
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
