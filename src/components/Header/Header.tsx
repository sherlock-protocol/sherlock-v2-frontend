import React, { useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import { FaExternalLinkAlt, FaLock, FaUnlock } from "react-icons/fa"

import ConnectButton from "../ConnectButton/ConnectButton"
import CustomLink from "../CustomLink/CustomLink"
import { Route } from "../../utils/routes"

import { ReactComponent as Logotype } from "../../assets/icons/logotype.svg"

import styles from "./Header.module.scss"
import { Row } from "../Layout"
import { useAuthentication } from "../../hooks/api/useAuthentication"
import { useProfile } from "../../hooks/api/auditors"

export type NavigationLink = {
  title: string
  route: Route
  external?: boolean
  protected?: boolean
}

type HeaderProps = {
  navigationLinks?: NavigationLink[]

  /**
   * If the Header should show nothing but the logo.
   */
  logoOnly?: boolean

  /**
   * Home route
   */
  homeRoute?: string
}

/**
 * Header component including the navigation and the wallet connection.
 */
export const Header: React.FC<HeaderProps> = ({ navigationLinks = [], logoOnly = false, homeRoute = "/" }) => {
  const { authenticate } = useAuthentication()
  const { data: authenticatedProfile, isFetched } = useProfile()

  const isAuthenticated = useMemo(() => isFetched && authenticatedProfile, [isFetched, authenticatedProfile])

  const handleNavigationLinkClick = useCallback(
    async (navLink: NavigationLink) => {
      if (navLink.protected && !isAuthenticated) {
        await authenticate()
      }
    },
    [authenticate, isAuthenticated]
  )

  return (
    <div className={styles.container}>
      <div className={styles.leftArea}>
        <Link to={`/${homeRoute}`}>
          <Logotype height={60} width={60} />
        </Link>
      </div>
      {!logoOnly && (
        <div className={styles.centerArea}>
          <Row alignment={["center", "baseline"]}>
            {navigationLinks.map((navLink) => (
              <CustomLink
                key={navLink.route}
                to={navLink.route}
                onClick={() => handleNavigationLinkClick(navLink)}
                target={navLink.external ? "_blank" : "_self"}
              >
                {navLink.title}
                {navLink.protected && !isAuthenticated && <FaLock />}
                {navLink.external && <FaExternalLinkAlt />}
              </CustomLink>
            ))}
          </Row>
        </div>
      )}
      {!logoOnly && (
        <div className={styles.rightArea}>
          <Row alignment="end" grow={0}>
            <ConnectButton />
          </Row>
        </div>
      )}
    </div>
  )
}
