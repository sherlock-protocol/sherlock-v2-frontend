import React from "react"
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

function App() {
  const location = useLocation()

  const navigationLinks: NavigationLink[] =
    location.pathname.endsWith("fundraise") || location.pathname.endsWith("fundraiseclaim")
      ? [
          {
            title: "FUNDRAISE",
            route: routes.Fundraise,
          },
          {
            title: "CLAIM",
            route: routes.FundraiseClaim,
          },
        ]
      : [
          {
            title: "STAKE",
            route: routes.Stake,
          },
          {
            title: "POSITIONS",
            route: routes.Positions,
          },
        ]

  return (
    <div className={styles.app}>
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
