import React from "react"
import { Text } from "../Text"
import styles from "./Select.module.scss"
import { FaCaretUp } from "react-icons/fa"
import { Box, HStack } from "@chakra-ui/react"

type Props = {
  label: string
  value: string
  selected?: boolean
  onSelect: (value: string) => void
}

const Option: React.FC<Props> = ({ label, value, selected, onSelect }) => {
  return (
    <HStack
      w="full"
      onClick={() => onSelect(value)}
      justifyContent="space-between"
      spacing={4}
      p={3}
      cursor="pointer"
      bg={selected ? "brand.500" : "brand.900"}
      _hover={{ bg: "brand.600" }}
      className={styles.ellipsis}
      userSelect="none"
    >
      <Text strong>{label}</Text>
      {selected ? <FaCaretUp size={18} color="white" /> : <Box h={4} w={4} bg="brand.400" />}
    </HStack>
  )
}

export default Option
