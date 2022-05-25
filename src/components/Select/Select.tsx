import React from "react"
import styles from "./Select.module.scss"
import { Text } from "../Text"
import { FaCaretDown } from "react-icons/fa"
import Option from "./Option"
import { Box, HStack, VStack } from "@chakra-ui/react"

type OptionType = {
  value: string
  label: string
}

type Props = {
  options: Array<OptionType>
  onChange: (value: string) => void
  value?: string
}

/**
 * Custom Select/Dropdown component
 */
const Select: React.FC<Props> = ({ options, onChange, value }) => {
  // const [selectedOption, setSelectedOption] = React.useState<string>()
  const selectedOptionLabel = React.useMemo(
    () => options?.find((item) => item.value === value)?.label,
    [value, options]
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
    (option: string) => {
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
    if (options && options.length > 0 && !value) {
      handleUpdateSelectedOption(options[0].value)
    }
  }, [options, value, handleUpdateSelectedOption])

  return (
    <Box position="relative">
      <HStack
        bg="brand.500"
        _hover={{ bg: "brand.600" }}
        _active={{ bg: "brand.700" }}
        cursor="pointer"
        spacing={4}
        p={3}
        onClick={handleToggleDropdown}
        className={styles.ellipsis}
        minW="200px"
        justifyContent="space-between"
        userSelect="none"
      >
        <Text strong>{hasOptions ? selectedOptionLabel : "No entries"}</Text>
        {hasOptions && <FaCaretDown size={18} color="white" />}
      </HStack>
      {optionsVisible && (
        <>
          <VStack position="absolute" top={0} left={0} right={0} spacing={0} w="full" zIndex={9}>
            {orderedOptions?.map((item) => (
              <Option
                key={item.value}
                value={item.value}
                label={item.label}
                onSelect={handleUpdateSelectedOption}
                selected={value === item.value}
              />
            ))}
          </VStack>
          <Box
            position="fixed"
            top={0}
            right={0}
            bottom={0}
            left={0}
            bg="bg"
            opacity={0.7}
            onClick={handleToggleDropdown}
            zIndex={2}
          />
        </>
      )}
    </Box>
  )
}

export default Select
