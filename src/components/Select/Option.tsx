import React from "react"
import { Column, Row } from "../Layout"
import { Text } from "../Text"
import styles from "./Select.module.scss"
import cx from "classnames"
import { FaCaretUp } from "react-icons/fa"

type Props = {
  label: string
  value: string
  selected?: boolean
  onSelect: (value: string) => void
}

const Option: React.FC<Props> = ({ label, value, selected, onSelect }) => {
  return (
    <Row
      grow={1}
      className={cx(styles.option, { [styles.selected]: selected })}
      onClick={() => onSelect(value)}
      alignment="space-between"
      spacing="m"
    >
      <Column grow={1} className={styles.selectedOptionContainer}>
        <Text strong>{label}</Text>
      </Column>
      <Column>{selected ? <FaCaretUp size={18} color="white" /> : <div className={styles.optionCheckbox} />}</Column>
    </Row>
  )
}

export default Option
