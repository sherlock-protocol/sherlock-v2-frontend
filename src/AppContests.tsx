import React from "react"
import { Outlet } from "react-router-dom"
import { Header, NavigationLink } from "./components/Header"
import { contestsRoutes } from "./utils/routes"
import { Footer } from "./components/Footer"

import styles from "./App.module.scss"

export const AppContests = () => {
  const navigationLinks: NavigationLink[] = [
    {
      title: "CONTESTS",
      route: contestsRoutes.Contests,
    },
  ]

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
