import React from "react"
import styles from "./Select.module.scss"
import { Column, Row } from "../Layout"
import { Text } from "../Text"
import { FaCaretDown } from "react-icons/fa"
import Option from "./Option"

type OptionType = {
  value: string
  label: string
}

type Props = {
  options: Array<OptionType>
  onChange: (value: string) => void
  initialOption: string
}

/**
 * Custom Select/Dropdown component
 */
const Select: React.FC<Props> = ({ options, onChange, initialOption }) => {
  const [selectedOption, setSelectedOption] = React.useState<string>()
  const selectedOptionLabel = React.useMemo(
    () => options?.find((item) => item.value === selectedOption)?.label,
    [selectedOption, options]
  )
  const orderedOptions = React.useMemo(
    () => [...options].sort((a, b) => (a.value === selectedOption ? -1 : 1)),
    [options, selectedOption]
  )
  const [optionsVisible, setOptionsVisible] = React.useState(false)

  const handleUpdateSelectedOption = React.useCallback(
    (option: string) => {
      setOptionsVisible(false)
      setSelectedOption(option)
      onChange?.(option)
    },
    [onChange]
  )

  const handleToggleDropdown = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation()
      setOptionsVisible(!optionsVisible)
    },
    [optionsVisible]
  )

  React.useEffect(() => {
    setSelectedOption(initialOption)
  }, [initialOption])

  return (
    <Column className={styles.container}>
      <Row className={styles.button} spacing="m" alignment="space-between" onClick={handleToggleDropdown}>
        <Column grow={1} className={styles.selectedOptionContainer}>
          <Text strong>{selectedOptionLabel}</Text>
        </Column>
        <Column>
          <FaCaretDown size={18} color="white" />
        </Column>
      </Row>
      {optionsVisible && (
        <>
          <div className={styles.optionsContainer}>
            {orderedOptions?.map((item) => (
              <Option
                key={item.value}
                value={item.value}
                label={item.label}
                onSelect={handleUpdateSelectedOption}
                selected={selectedOption === item.value}
              />
            ))}
          </div>
          <div className={styles.backdrop} onClick={handleToggleDropdown} />
        </>
      )}
    </Column>
  )
}

export default Select
