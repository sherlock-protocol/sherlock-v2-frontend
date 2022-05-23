import { BigNumber, utils } from "ethers"
import React from "react"
import cx from "classnames"
import { formatAmount } from "../../utils/format"
import { Button } from "../Button/Button"
import { Input } from "../Input"
import { decimalsByToken, InputProps } from "../Input/Input"
import { Text } from "../Text"
import styles from "./TokenInput.module.scss"
import { HStack, VStack } from "@chakra-ui/react"

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
    <VStack w="full" spacing={4}>
      <HStack w="full" alignItems="center" spacing={4} className={cx({ [styles.disabled]: disabled })}>
        <Input value={controlledValue} {...props} />
        <Text size="extra-large" strong>
          {props.token}
        </Text>
      </HStack>
      {balance && !disabled && (
        <HStack w="full" alignItems="center" justifyContent="flex-end">
          <Text className={styles.balance}>
            Balance: {formatAmount(utils.formatUnits(balance, decimalsByToken[props.token]))}
          </Text>
          <Button variant="primary" size="small" onClick={handleSetMax}>
            MAX
          </Button>
        </HStack>
      )}
    </VStack>
  )
}

export default TokenInput
