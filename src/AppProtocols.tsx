import React from "react"
import { Outlet } from "react-router-dom"
import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"

import styles from "./App.module.scss"
import { protocolsRoutes } from "./utils/routes"

const AppProtocols = () => {
  const navigationLinks: NavigationLink[] = [
    {
      title: "BALANCE",
      route: protocolsRoutes.Balance,
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

export default AppProtocols
