import React, { useEffect, useState } from "react"
import { Route, Routes, useLocation, Navigate } from "react-router-dom"

import { StakingPage } from "./pages/Staking"
import { StakingPositionsPage } from "./pages/StakingPositions"
import { FundraisingPage } from "./pages/Fundraising"
import { FundraisingClaimPage } from "./pages/FundraisingClaim"
import { CountdownPage } from "./pages/Countdown"
import { ProtocolPage } from "./pages/Protocol"

import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"

import { routes } from "./utils/routes"

import styles from "./App.module.scss"
import { useFundraisePosition } from "./hooks/api/useFundraisePosition"
import { useAccount } from "wagmi"
import useCountdown from "./hooks/useCountdown"
import { USForbiddenPage } from "./pages/USForbidden"

export const LAUNCH_TIMESTAMP = parseInt(process.env.REACT_APP_LAUNCH_TIMESTAMP as string)

function App() {
  const location = useLocation()
  const [{ data: accountData }] = useAccount()
  const { getFundraisePosition, data: fundraisePositionData } = useFundraisePosition()
  const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([])
  const { ended, secondsLeft } = useCountdown(LAUNCH_TIMESTAMP)

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
      <Header navigationLinks={navigationLinks} logoOnly={!ended} />
      <div className={styles.content}>
        <Routes>
          {ended ? (
            <>
              <Route index element={<StakingPage />} />
              <Route path={routes.Stake} element={<StakingPage />} />
              <Route path={routes.Positions} element={<StakingPositionsPage />} />
              <Route path={routes.Fundraise} element={<FundraisingPage />} />
              <Route path={routes.FundraiseClaim} element={<FundraisingClaimPage />} />
              <Route path={routes.Protocol} element={<ProtocolPage />} />
              <Route path={routes.USForbidden} element={<USForbiddenPage />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </>
          ) : (
            <>
              <Route index element={<CountdownPage secondsLeft={secondsLeft} />} />
              <Route path={routes.USForbidden} element={<USForbiddenPage />} />
            </>
          )}
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
