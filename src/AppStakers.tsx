import React, { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useAccount } from "wagmi"
import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"
import { useFundraisePosition } from "./hooks/api/useFundraisePosition"
import { routes } from "./utils/routes"

import styles from "./App.module.scss"
import { Box, VStack } from "@chakra-ui/react"

const AppStakers = () => {
  const [{ data: accountData }] = useAccount()
  const { getFundraisePosition, data: fundraisePositionData } = useFundraisePosition()

  useEffect(() => {
    if (accountData?.address) {
      getFundraisePosition(accountData.address)
    }
  }, [accountData?.address, getFundraisePosition])

  const navigationLinks: NavigationLink[] = [
    {
      title: "OVERVIEW",
      route: routes.Overview,
    },
    {
      title: "STAKE",
      route: routes.Stake,
    },
    {
      title: "POSITIONS",
      route: routes.Positions,
    },
    {
      title: "PROTOCOLS",
      route: routes.Protocols,
      external: true,
    },
  ]

  if (fundraisePositionData) {
    navigationLinks.push({
      title: "CLAIM",
      route: routes.FundraiseClaim,
    })
  }

  return (
    <VStack w="full" minH="100vh" bg="bg">
      <Header navigationLinks={navigationLinks} />
      <Box w="full" flexGrow={1}>
        <div className={styles.noise} />
        <Outlet />
      </Box>
      <Footer />
    </VStack>
  )
}

export default AppStakers
