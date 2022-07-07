import React from "react"
import styles from "./Select.module.scss"
import { Column, Row } from "../Layout"
import { Text } from "../Text"
import { FaCaretDown } from "react-icons/fa"
import Option from "./Option"

type OptionType<T> = {
  value: T
  label: string
}

type Props<T> = {
  options: Array<OptionType<T>>
  onChange: (value: T) => void
  value?: T
  placeholder?: string
}

/**
 * Custom Select/Dropdown component
 */
const Select = <T,>({ options, onChange, value, placeholder }: Props<T>) => {
  // const [selectedOption, setSelectedOption] = React.useState<string>()
  const selectedOptionLabel = React.useMemo(
    () => options?.find((item) => item.value === value)?.label ?? placeholder,
    [value, options, placeholder]
  )
  const orderedOptions = React.useMemo(
    () => [...options].sort((a, b) => b.label.localeCompare(a.label)).sort((a, b) => (a.value === value ? -1 : 1)),
    [options, value]
  )
  const hasOptions = React.useMemo(() => {
    return orderedOptions.length > 0
  }, [orderedOptions])
  const [optionsVisible, setOptionsVisible] = React.useState(false)

  const handleUpdateSelectedOption = React.useCallback(
    (option: T) => {
      setOptionsVisible(false)
      onChange?.(option)
    },
    [onChange]
  )

  const handleToggleDropdown = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation()

      if (hasOptions) {
        setOptionsVisible(!optionsVisible)
      }
    },
    [optionsVisible, hasOptions]
  )

  React.useEffect(() => {
    if (options && options.length > 0 && !value && !placeholder) {
      handleUpdateSelectedOption(options[0].value)
    }
  }, [options, value, handleUpdateSelectedOption, placeholder])

  return (
    <Column className={styles.container}>
      <Row className={styles.button} spacing="m" alignment="space-between" onClick={handleToggleDropdown}>
        <Column grow={1} className={styles.selectedOptionContainer}>
          <Text strong>{hasOptions ? selectedOptionLabel : "No entries"}</Text>
        </Column>
        {hasOptions && (
          <Column>
            <FaCaretDown size={18} color="white" />
          </Column>
        )}
      </Row>
      {optionsVisible && (
        <>
          <div className={styles.optionsContainer}>
            {!value && placeholder && (
              <Option key="placeholder" value={null} label={placeholder} onSelect={() => {}} selected />
            )}
            {orderedOptions?.map((item) => (
              <Option
                key={`${item.value}`}
                value={item.value}
                label={item.label}
                onSelect={handleUpdateSelectedOption}
                selected={value === item.value}
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
