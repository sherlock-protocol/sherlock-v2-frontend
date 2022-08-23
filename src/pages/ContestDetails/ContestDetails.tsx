import React from "react"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { useContest } from "../../hooks/api/contests"

import styles from "./ContestDetails.module.scss"
import aaveLogo from "../../assets/icons/aave-logo.png"
import { Title } from "../../components/Title"

export const ContestDetails = () => {
  const { data: contest } = useContest(4)

  return (
    <Box shadow={false} fullWidth className={styles.container}>
      <Row spacing="xl">
        <Column>
          <img src={aaveLogo} width={100} height={100} alt="AAVE" />
        </Column>
        <Column grow={1}>
          <Title variant="h1">{contest?.title}</Title>
        </Column>
        <Column grow={0.2}>sidebar</Column>
      </Row>
    </Box>
  )
}
