import React, { useEffect, useState } from "react"
import { Route, Routes, useLocation, Navigate } from "react-router-dom"

import { FundraisingClaimPage } from "./pages/FundraisingClaim"
import { StakingPage } from "./pages/Staking"
import { StakingPositionsPage } from "./pages/StakingPositions"
import { USForbiddenPage } from "./pages/USForbidden"
import { SherlockDashboardPage } from "./pages/SherlockDashboard"

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
    let links: NavigationLink[] = [
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
      links = [
        ...links,
        {
          title: "CLAIM",
          route: routes.FundraiseClaim,
        },
      ]
    }
    setNavigationLinks(links)
  }, [location.pathname, fundraisePositionData])

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <Header navigationLinks={navigationLinks} />
      <div className={styles.content}>
        <Routes>
          <Route path={routes.Stake} element={<StakingPage />} />
          <Route path={routes.Stats} element={<SherlockDashboardPage />} />
          <Route path={routes.Positions} element={<StakingPositionsPage />} />
          <Route path={routes.FundraiseClaim} element={<FundraisingClaimPage />} />
          <Route path={routes.USForbidden} element={<USForbiddenPage />} />
          <Route path="*" element={<Navigate replace to={routes.Stake} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
