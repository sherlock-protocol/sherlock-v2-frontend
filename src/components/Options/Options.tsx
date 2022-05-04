import React from "react"
import { Column, Row } from "../Layout"
import styles from "./Options.module.scss"
import cx from "classnames"
import { Text } from "../Text"

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
    <Row grow={1} className={styles.container}>
      {options.map((option) => (
        <Column
          alignment={["center", "center"]}
          grow={1}
          key={option.value}
          className={cx(styles.option, { [styles.active]: option.value === value })}
          onClick={() => onChange(option.value)}
        >
          <Text strong>{option.label}</Text>
        </Column>
      ))}
    </Row>
  )
}

export default Options
