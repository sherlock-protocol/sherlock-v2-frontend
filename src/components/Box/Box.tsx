import React, { PropsWithChildren } from "react"
import { Box as ChakraBox, useBreakpointValue } from "@chakra-ui/react"

import styles from "./Box.module.scss"

type Props = {
  shadow?: boolean
  fullWidth?: boolean
}

export const Box: React.FC<PropsWithChildren<Props>> = ({ children, shadow = true, fullWidth = false }) => {
  const isShadowShown = useBreakpointValue({ base: false, md: true })

  return (
    <ChakraBox w={fullWidth ? "full" : "fit-content"} p={{ base: 0, md: 8 }}>
      <ChakraBox w="full" p={8} position="relative" className={styles.box}>
        {shadow && isShadowShown && <div className={styles.shadow}></div>}
        {children}
      </ChakraBox>
    </ChakraBox>
  )
}
