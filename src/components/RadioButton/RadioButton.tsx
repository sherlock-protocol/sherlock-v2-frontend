import { Column, Row } from "../Layout"
import { Text } from "../Text"
import styles from "./RadioButton.module.scss"
import cx from "classnames"

type Props = {
  value: any
  label?: string
  options: Array<{
    label: string
    value: any
  }>
  onChange: (value: any) => void
}

const RadioButton: React.FC<Props> = ({ options, value, label, onChange }) => {
  return (
    <Column spacing="xs">
      {label && (
        <Text size="small" strong>
          {label}
        </Text>
      )}
      <div className={styles.options}>
        {options.map((option) => (
          <div
            key={option.label}
            className={cx(styles.option, { [styles.active]: value === option.value })}
            onClick={() => onChange?.(option.value)}
          >
            <Text>{option.label}</Text>
          </div>
        ))}
      </div>
    </Column>
  )
}

export default RadioButton
