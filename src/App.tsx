import React, { useEffect, useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"

import { StakingPage } from "./pages/Staking"
import { StakingPositionsPage } from "./pages/StakingPositions"
import { FundraisingPage } from "./pages/Fundraising"
import { FundraisingClaimPage } from "./pages/FundraisingClaim"
import { ProtocolPage } from "./pages/Protocol"

import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"

import { routes } from "./utils/routes"

import styles from "./App.module.scss"
import { useFundraisePosition } from "./hooks/api/useFundraisePosition"
import { useAccount } from "wagmi"

function App() {
  const location = useLocation()
  const [{ data: accountData }] = useAccount()
  const { getFundraisePosition, data: fundraisePositionData } = useFundraisePosition()
  const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([])

  useEffect(() => {
    if (accountData?.address) {
      getFundraisePosition(accountData.address)
    }
  }, [accountData?.address, getFundraisePosition])

  useEffect(() => {
    if (location.pathname.endsWith("fundraise") || location.pathname.endsWith("fundraiseclaim")) {
      let links: NavigationLink[] = [
        {
          title: "FUNDRAISE",
          route: routes.Fundraise,
        },
      ]

      if (fundraisePositionData) {
        links = [
          ...links,
          {
            title: "CLAIM",
            route: routes.FundraiseClaim,
          },
        ]
      }
      setNavigationLinks(links)
    } else {
      setNavigationLinks([
        {
          title: "STAKE",
          route: routes.Stake,
        },
        {
          title: "POSITIONS",
          route: routes.Positions,
        },
      ])
    }
  }, [location.pathname, fundraisePositionData])

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <Header navigationLinks={navigationLinks} />
      <div className={styles.content}>
        <Routes>
          <Route index element={<StakingPage />} />
          <Route path={routes.Stake} element={<StakingPage />} />
          <Route path={routes.Positions} element={<StakingPositionsPage />} />
          <Route path={routes.Fundraise} element={<FundraisingPage />} />
          <Route path={routes.FundraiseClaim} element={<FundraisingClaimPage />} />
          <Route path={routes.Protocol} element={<ProtocolPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
