import React, { useCallback } from "react"
import { Outlet } from "react-router-dom"
import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"

import styles from "./App.module.scss"
import { adminRoutes } from "./utils/routes"
import { useAdminProfile } from "./hooks/api/admin/useAdminProfile"
import { Button } from "./components/Button"
import { Box } from "./components/Box"
import { useAdminSignIn } from "./hooks/api/admin/useAdminSignIn"
import { ErrorModal } from "./pages/ContestDetails/ErrorModal"

const AppInternal = () => {
  const { data: adminAddress } = useAdminProfile()
  const { signIn, error, reset } = useAdminSignIn()

  const handleSignInAsAdmin = useCallback(() => {
    signIn()
  }, [signIn])

  const handleErrorModalClose = useCallback(() => {
    reset()
  }, [reset])

  const navigationLinks: NavigationLink[] = adminAddress
    ? [
        {
          title: "OVERVIEW",
          route: adminRoutes.InternalOverview,
        },
        {
          title: "CONTESTS",
          route: adminRoutes.Contests,
        },
      ]
    : []

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <Header navigationLinks={navigationLinks} />
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          {adminAddress ? (
            <Outlet />
          ) : (
            <Box shadow={false}>
              <Button onClick={handleSignInAsAdmin}>Sign in as Admin</Button>
            </Box>
          )}
          {error && <ErrorModal reason={error.fieldErrors} onClose={handleErrorModalClose} />}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AppInternal
