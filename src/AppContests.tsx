import React, { useLayoutEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Header, NavigationLink } from "./components/Header"
import { contestsRoutes, routes } from "./utils/routes"
import { Footer } from "./components/Footer"

import styles from "./App.module.scss"
import { useScoreboard } from "./hooks/api/contests"
import { useAccount } from "wagmi"
import { useIsAuditor } from "./hooks/api/auditors"

export const AppContests = () => {
  const { address: connectedAddress } = useAccount()
  const { data: isAuditor } = useIsAuditor(connectedAddress)
  const { data: scoreboard } = useScoreboard()
  const contentRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Scroll to top if path changes
  useLayoutEffect(() => {
    contentRef.current?.scrollTo(0, 0)
  }, [location.pathname])

  const navigationLinks: NavigationLink[] = [
    {
      title: "CONTESTS",
      route: contestsRoutes.Contests,
    },
  ]

  if (scoreboard && scoreboard.length > 0) {
    navigationLinks.push({
      title: "LEADERBOARD",
      route: contestsRoutes.Leaderboard,
    })
  }

  if (isAuditor) {
    navigationLinks.push({
      title: "PROFILE",
      protected: true,
      route: contestsRoutes.Profile,
    })
  }

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <Header navigationLinks={navigationLinks} homeRoute={routes.AuditContests} />
      <div className={styles.contentContainer} ref={contentRef}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}
