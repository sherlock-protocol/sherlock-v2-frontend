import React from "react"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"

import styles from "./SherlockDashboardPage.module.scss"

export const SherlockDashboardPage: React.FC = () => {
  return (
    <Box>
      <Column spacing="m">
        <Row>
          <Title variant="h3">STAKING POOL</Title>
        </Row>
        <Row>
          <Title>$22,056,005.00</Title>
        </Row>
      </Column>
    </Box>
  )
}
