import React, { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useAccount } from "wagmi"
import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"
import { useFundraisePosition } from "./hooks/api/useFundraisePosition"
import { routes } from "./utils/routes"

import styles from "./App.module.scss"

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
  ]

  if (fundraisePositionData) {
    navigationLinks.push({
      title: "CLAIM",
      route: routes.FundraiseClaim,
    })
  }

  navigationLinks.push({
    title: "PROTOCOLS",
    route: routes.Protocols,
    external: true,
  })

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <Header navigationLinks={navigationLinks} />
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AppStakers
