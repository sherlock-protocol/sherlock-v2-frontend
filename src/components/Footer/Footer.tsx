import React, { PropsWithChildren } from "react"
import footerShadow from "../../assets/images/footer_shadow.svg"
import { Text } from "../Text"
import { FaTwitter, FaDiscord, FaGithub } from "react-icons/fa"

import { Box, Flex, HStack, Icon, useBreakpointValue } from "@chakra-ui/react"
import styles from "./Footer.module.scss"

export const Footer: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const iconSize = useBreakpointValue({ base: 6, md: 8 })

  const iconProps = React.useMemo(
    () => ({
      height: iconSize,
      width: iconSize,
      color: "whiteAlpha.700",
      _hover: {
        color: "white",
      },
    }),
    [iconSize]
  )

  return (
    <Box w="full" position="relative">
      <img src={footerShadow} alt="" />
      <HStack
        w="full"
        h={20}
        px={{ base: 4, md: 8 }}
        justifyContent="space-between"
        bgGradient="linear(to-b, gradients.sherlock.0, gradients.sherlock.1)"
      >
        <HStack flex={{ base: 0, md: 1 }} spacing={{ base: 4, md: 8 }} alignItems="center" className={styles.fade}>
          <a href="https://discord.gg/MABEWyASkp" target="_blank" rel="noreferrer">
            <Icon as={FaDiscord} {...iconProps} />
          </a>
          <a href="https://github.com/sherlock-protocol/sherlock-v2-frontend" target="_blank" rel="noreferrer">
            <Icon as={FaGithub} {...iconProps} />
          </a>
          <a href="https://twitter.com/sherlockdefi" target="_blank" rel="noreferrer">
            <Icon as={FaTwitter} {...iconProps} />
          </a>
        </HStack>
        <Flex flex={1} justifyContent={{ base: "flex-end", md: "center" }}>
          <Text size="tiny">©2022 SHERLOCK. ALL RIGHTS RESERVED</Text>
        </Flex>
        <Box flex={1} display={{ base: "none", md: "block" }} />
      </HStack>
    </Box>
  )
}
