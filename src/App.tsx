import React, { useEffect, useMemo, useState } from "react"
import { Route, Routes, useLocation, Navigate } from "react-router-dom"

import { FundraisingPage } from "./pages/Fundraising"
import { FundraisingClaimPage } from "./pages/FundraisingClaim"
import { StakingPage } from "./pages/Staking"
import { StakingPositionsPage } from "./pages/StakingPositions"
import { USForbiddenPage } from "./pages/USForbidden"

import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"

import { routes } from "./utils/routes"

import styles from "./App.module.scss"
import { useFundraisePosition } from "./hooks/api/useFundraisePosition"
import { useAccount } from "wagmi"
import config from "./config"

export const LAUNCH_TIMESTAMP = config.launchTimestamp
export const SHER_BUY_ENTRY_DEADLINE = Number.isInteger(config.sherBuyEntryDeadline) ? config.sherBuyEntryDeadline : 0

function App() {
  const location = useLocation()
  const [{ data: accountData }] = useAccount()
  const { getFundraisePosition, data: fundraisePositionData } = useFundraisePosition()
  const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([])

  const fundraiseIsFinished = useMemo(() => Date.now() > SHER_BUY_ENTRY_DEADLINE * 1000, [])

  useEffect(() => {
    if (accountData?.address) {
      getFundraisePosition(accountData.address)
    }
  }, [accountData?.address, getFundraisePosition])

  useEffect(() => {
    let links: NavigationLink[] = fundraiseIsFinished
      ? [
          {
            title: "STAKE",
            route: routes.Stake,
          },
          {
            title: "POSITIONS",
            route: routes.Positions,
          },
        ]
      : [
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
  }, [location.pathname, fundraisePositionData, fundraiseIsFinished])

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <Header navigationLinks={navigationLinks} />
      <div className={styles.content}>
        <Routes>
          {fundraiseIsFinished ? (
            <>
              <Route path={routes.Stake} element={<StakingPage />} />
              <Route path={routes.Positions} element={<StakingPositionsPage />} />
              <Route path={routes.FundraiseClaim} element={<FundraisingClaimPage />} />
              <Route path={routes.USForbidden} element={<USForbiddenPage />} />
              <Route path="*" element={<Navigate replace to={routes.Stake} />} />
            </>
          ) : (
            <>
              <Route path={routes.Fundraise} element={<FundraisingPage />} />
              <Route path={routes.FundraiseClaim} element={<FundraisingClaimPage />} />
              <Route path={routes.USForbidden} element={<USForbiddenPage />} />
              <Route path="*" element={<Navigate replace to={routes.Fundraise} />} />
            </>
          )}
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
