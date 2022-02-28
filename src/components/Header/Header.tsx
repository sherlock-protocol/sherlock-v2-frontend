import React from "react"

import ConnectButton from "../ConnectButton/ConnectButton"
import CustomLink from "../CustomLink/CustomLink"
import { Route } from "../../utils/routes"

import { ReactComponent as Logotype } from "../../assets/icons/logotype.svg"

import styles from "./Header.module.scss"
import { Column, Row } from "../Layout"

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
    <Row spacing="m" className={styles.container}>
      <Column grow={1}>
        <Logotype height={60} width={60} />
      </Column>
      <Column grow={1} className={styles.centerArea}>
        <Row alignment="center" spacing="m">
          {navigationLinks.map((navLink) => (
            <CustomLink key={navLink.route} to={navLink.route}>
              {navLink.title}
            </CustomLink>
          ))}
        </Row>
      </Column>
      <Column grow={1}>
        <Row alignment="end" grow={0}>
          <ConnectButton />
        </Row>
      </Column>
    </Row>
  )
}
