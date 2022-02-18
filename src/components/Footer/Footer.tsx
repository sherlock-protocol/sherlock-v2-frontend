import React from "react"
import { Column, Row } from "../Layout"
import { Text } from "../Text"
import { FaTwitter, FaDiscord, FaGithub } from "react-icons/fa"

import styles from "./Footer.module.scss"

export const Footer: React.FC = ({ children }) => (
  <div className={styles.footer}>
    <img
      src="https://uploads-ssl.webflow.com/6176d669c3360a6d1836d422/61cc2b6c39c94d6772972b25_Rectangle%2089%20(1).svg"
      loading="eager"
      alt=""
    />
    <div className={styles.bottom}></div>
    <div className={styles.content}>
      <Row className={styles.contentContainer} alignment={["space-between", "center"]} spacing="m">
        <Column className={styles.links}>
          <Row spacing="xl">
            <a href="https://discord.gg/MABEWyASkp" target="_blank" rel="noreferrer">
              <FaDiscord size={32} />
            </a>
            <a href="https://github.com/sherlock-protocol/sherlock-v2-frontend" target="_blank" rel="noreferrer">
              <FaGithub size={32} />
            </a>
            <a href="https://twitter.com/sherlockdefi" target="_blank" rel="noreferrer">
              <FaTwitter size={32} />
            </a>
          </Row>
        </Column>
        <Column alignment="center">
          <Text size="small">©2022 SHERLOCK. ALL RIGHTS RESERVED</Text>
        </Column>
        <Column></Column>
      </Row>
    </div>
  </div>
)
