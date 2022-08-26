import React from "react"
import { Link } from "react-router-dom"
import { FaExternalLinkAlt } from "react-icons/fa"

import ConnectButton from "../ConnectButton/ConnectButton"
import CustomLink from "../CustomLink/CustomLink"
import { Route } from "../../utils/routes"

import { ReactComponent as Logotype } from "../../assets/icons/logotype.svg"

import styles from "./Header.module.scss"
import { Row } from "../Layout"

export type NavigationLink = {
  title: string
  route: Route
  external?: boolean
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
  return (
    <div className={styles.container}>
      <div className={styles.leftArea}>
        <Link to={`/${homeRoute}`}>
          <Logotype height={60} width={60} />
        </Link>
      </div>
      {!logoOnly && (
        <div className={styles.centerArea}>
          <Row alignment={["center", "center"]}>
            {navigationLinks.map((navLink) => (
              <CustomLink key={navLink.route} to={navLink.route} target={navLink.external ? "_blank" : "_self"}>
                {navLink.title}
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
