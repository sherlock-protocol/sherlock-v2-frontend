import React from "react"
import { Outlet } from "react-router-dom"
import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"

import styles from "./App.module.scss"
import { adminRoutes } from "./utils/routes"

const AppInternal = () => {
  const navigationLinks: NavigationLink[] = [
    {
      title: "OVERVIEW",
      route: adminRoutes.InternalOverview,
    },
  ]

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <Header navigationLinks={navigationLinks} connectButton={false} />
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AppInternal
