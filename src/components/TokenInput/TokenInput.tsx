import { BigNumber, utils } from "ethers"
import React from "react"
import { Button } from "../Button/Button"
import { Input } from "../Input"
import { decimalsByToken, InputProps } from "../Input/Input"
import { Column, Row } from "../Layout"
import { Text } from "../Text"
import styles from "./TokenInput.module.scss"

type Props = InputProps & {
  balance?: BigNumber
}

const TokenInput: React.FC<Props> = ({ balance, ...props }) => {
  const [value, setValue] = React.useState<BigNumber>()

  const handleSetMax = React.useCallback(() => {
    setValue(balance)
  }, [balance])

  return (
    <>
      <Row alignment={["space-between", "center"]} spacing="xl">
        <Column grow={1}>
          <Input value={value} {...props} />
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
            Balance: {utils.commify(utils.formatUnits(balance, decimalsByToken[props.token]))}
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
