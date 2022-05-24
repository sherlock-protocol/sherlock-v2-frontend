import React from "react"
import ConnectButton from "../ConnectButton/ConnectButton"
import { Route } from "../../utils/routes"
import { FaExternalLinkAlt } from "react-icons/fa"

import { ReactComponent as Logotype } from "../../assets/icons/logotype.svg"
import { ReactComponent as Logo } from "../../assets/icons/logo.svg"

import { NavLink } from "react-router-dom"
import { Box, Flex, HStack, Icon, IconButton, useDisclosure, VStack } from "@chakra-ui/react"
import { GiHamburgerMenu } from "react-icons/gi"
import { GrClose } from "react-icons/gr"
import { Text } from "../Text"
import CustomLink from "../CustomLink/CustomLink"

export type NavigationLink = {
  title: string
  route: Route
  external?: boolean
}

type HeaderProps = {
  navigationLinks?: NavigationLink[]

  /**
   * If the Header should show nothing but the logo.
   */
  logoOnly?: boolean
}

/**
 * Header component including the navigation and the wallet connection.
 */
export const Header: React.FC<HeaderProps> = ({ navigationLinks = [], logoOnly = false }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <Box w="full" px={{ base: 4, md: 16 }} py={{ base: 4, md: 8 }}>
      <Flex w="full" h={16} alignItems="center" justifyContent="center">
        <Flex flex={1} alignItems="flex-start" display={{ md: "none" }}>
          <IconButton
            hidden={logoOnly}
            size={"md"}
            icon={isOpen ? <Icon as={GrClose} /> : <Icon as={GiHamburgerMenu} />}
            aria-label={"Open Menu"}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>

        <Flex display={{ base: "none", md: "flex" }} flex={1} alignItems="center">
          <NavLink to="/">
            <Logotype height={60} width={60} />
          </NavLink>
        </Flex>

        <HStack flex={1} spacing={4} display={{ base: "none", md: "flex" }} alignItems="space-between">
          <HStack hidden={logoOnly} flex={1} as={"nav"} spacing={8} alignItems="center" justifyContent="center">
            {navigationLinks.map((navLink) => (
              <CustomLink key={navLink.route} to={navLink.route}>
                <HStack>
                  <Text strong>{navLink.title}</Text> {navLink.external && <FaExternalLinkAlt />}
                </HStack>
              </CustomLink>
            ))}
          </HStack>
        </HStack>

        <Flex flex={1} justifyContent="center" display={{ base: "flex", md: "none" }}>
          <NavLink to="/">
            <Logo height={40} />
          </NavLink>
        </Flex>

        <Flex hidden={logoOnly} flex={1} alignItems="center" justifyContent="flex-end">
          <Box display={{ base: "none", sm: "flex" }}>
            <ConnectButton />
          </Box>
        </Flex>
      </Flex>
      {isOpen ? (
        <Box py={4} display={{ md: "none" }}>
          <VStack as={"nav"} spacing={4} alignItems="flex-start">
            {navigationLinks.map((navLink) => (
              <CustomLink key={navLink.route} to={navLink.route}>
                <Text strong>{navLink.title}</Text>
              </CustomLink>
            ))}
            <Box display={{ base: "flex", sm: "none" }}>
              <ConnectButton />
            </Box>
          </VStack>
        </Box>
      ) : null}
    </Box>
  )
}
