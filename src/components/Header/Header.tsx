import React from "react"

import ConnectButton from "../ConnectButton/ConnectButton"
import CustomLink from "../CustomLink/CustomLink"
import { Route } from "../../utils/routes"

import { ReactComponent as Logotype } from "../../assets/icons/logotype.svg"

import styles from "./Header.module.scss"
import { Row } from "../Layout"

export type NavigationLink = {
  title: string
  route: Route
}

type HeaderProps = {
  navigationLinks?: NavigationLink[]
}

/**
 * Header component including the navigation and the wallet connection.
 */
export const Header: React.FC<HeaderProps> = ({ navigationLinks = [] }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftArea}>
        <Logotype height={60} width={60} />
      </div>
      <div className={styles.centerArea}>
        <Row alignment="center">
          {navigationLinks.map((navLink) => (
            <CustomLink key={navLink.route} to={navLink.route}>
              {navLink.title}
            </CustomLink>
          ))}
        </Row>
      </div>
      <div className={styles.rightArea}>
        <Row alignment="end" grow={0}>
          <ConnectButton />
        </Row>
      </div>
    </div>
  )
}
