import React, { useLayoutEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Header, NavigationLink } from "./components/Header"
import { contestsRoutes, routes } from "./utils/routes"
import { Footer } from "./components/Footer"

import styles from "./App.module.scss"

export const AppContests = () => {
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
    {
      title: "SCOREBOARD",
      route: contestsRoutes.Scoreboard,
    },
  ]

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
