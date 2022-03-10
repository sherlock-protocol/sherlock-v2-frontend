import React, { useEffect, useState } from "react"
import { Route, Routes, useLocation, Navigate } from "react-router-dom"

import { FundraisingPage } from "./pages/Fundraising"
import { FundraisingClaimPage } from "./pages/FundraisingClaim"
import { CountdownPage } from "./pages/Countdown"

import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"

import { routes } from "./utils/routes"

import styles from "./App.module.scss"
import { useFundraisePosition } from "./hooks/api/useFundraisePosition"
import { useAccount } from "wagmi"
import useCountdown from "./hooks/useCountdown"
import { USForbiddenPage } from "./pages/USForbidden"
import config from "./config"

export const LAUNCH_TIMESTAMP = config.launchTimestamp

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
    let links: NavigationLink[] = []
    if (location.pathname.endsWith("fundraise") || location.pathname.endsWith("fundraiseclaim")) {
      links = [
        ...links,
        {
          title: "FUNDRAISE",
          route: routes.Fundraise,
        },
      ]
    } else {
      links = [
        ...links,
        {
          title: "STAKE",
          route: routes.Stake,
        },
        {
          title: "POSITIONS",
          route: routes.Positions,
        },
      ]
    }

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
      <Header navigationLinks={navigationLinks} logoOnly={!ended} />
      <div className={styles.content}>
        <Routes>
          {ended ? (
            <>
              <Route path={routes.Fundraise} element={<FundraisingPage />} />
              <Route path={routes.FundraiseClaim} element={<FundraisingClaimPage />} />
              <Route path={routes.USForbidden} element={<USForbiddenPage />} />
              <Route path="*" element={<Navigate replace to={routes.Fundraise} />} />
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
