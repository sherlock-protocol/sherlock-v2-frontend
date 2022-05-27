import React from "react"
import styles from "./Options.module.scss"
import cx from "classnames"
import { Text } from "../Text"
import { Flex, HStack } from "@chakra-ui/react"

type Props = {
  /**
   * Array of possible options
   */
  options: Array<{
    label: string
    value: any
  }>

  /**
   * Selected option's valuej
   */
  value: any

  /**
   * Callback when an option has been selected
   */
  onChange: (value: any) => void
}

const Options: React.FC<Props> = ({ options, value, onChange }) => {
  return (
    <HStack w="full" className={styles.container} spacing={0}>
      {options.map((option) => (
        <Flex
          py={3}
          px={1}
          w="full"
          justifyContent="center"
          alignItems="center"
          key={option.value}
          className={cx(styles.option, { [styles.active]: option.value === value })}
          onClick={() => onChange(option.value)}
        >
          <Text strong>{option.label}</Text>
        </Flex>
      ))}
    </HStack>
  )
}

export default Options
