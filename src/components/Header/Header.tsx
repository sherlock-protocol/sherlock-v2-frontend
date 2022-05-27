import React from "react"
import ConnectButton from "../ConnectButton/ConnectButton"
import { Route } from "../../utils/routes"
import { FaExternalLinkAlt } from "react-icons/fa"

import { ReactComponent as Logotype } from "../../assets/icons/logotype.svg"
import { ReactComponent as Logo } from "../../assets/icons/logo.svg"

import { NavLink, useLocation } from "react-router-dom"
import { Box, Flex, HStack, Icon, useDisclosure, VStack } from "@chakra-ui/react"
import { IoIosMenu, IoIosClose } from "react-icons/io"
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
  const location = useLocation()

  /**
   * Close nav menu after navigating
   */
  React.useEffect(() => onClose, [location, onClose])

  return (
    <Box w="full" px={{ base: 4, md: 16 }} py={{ base: 4, md: 8 }}>
      <HStack w="full" spacing={8} h={16} alignItems="center" justifyContent="center">
        <Flex
          alignItems="center"
          justifyContent="flex-start"
          flex={1}
          hidden={logoOnly}
          display={{ base: "flex", md: "none" }}
        >
          <Icon
            as={isOpen ? IoIosClose : IoIosMenu}
            color="whiteAlpha.800"
            _hover={{ color: "white" }}
            onClick={isOpen ? onClose : onOpen}
            height={8}
            width={8}
          />
        </Flex>

        <Box flex={1} display={{ base: "none", md: "flex" }}>
          <NavLink to="/">
            <Logotype height={60} width={60} />
          </NavLink>
        </Box>

        <HStack
          display={{ base: "none", md: "flex" }}
          hidden={logoOnly}
          flex={1}
          as={"nav"}
          spacing={8}
          alignItems="center"
          justifyContent="center"
        >
          {navigationLinks.map((navLink) => (
            <CustomLink key={navLink.route} to={navLink.route}>
              <HStack>
                <Text strong>{navLink.title}</Text> {navLink.external && <FaExternalLinkAlt />}
              </HStack>
            </CustomLink>
          ))}
        </HStack>

        <Box flex={1} display={{ base: "block", md: "none" }}>
          <NavLink to="/">
            <Logo height={40} width="auto" />
          </NavLink>
        </Box>

        <Flex hidden={logoOnly} flex={1} alignItems="center" justifyContent="flex-end">
          <Box display={{ base: "none", sm: "flex" }}>
            <ConnectButton />
          </Box>
        </Flex>
      </HStack>
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
