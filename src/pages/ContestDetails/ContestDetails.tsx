import React, { useCallback } from "react"
import { DateTime } from "luxon"

import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Button } from "../../components/Button"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"
import { commify } from "../../utils/units"
import { useContest, useSignatureVerification, useSignContestSignupMessage } from "../../hooks/api/contests"

import aaveLogo from "../../assets/icons/aave-logo.png"
import styles from "./ContestDetails.module.scss"

export const ContestDetails = () => {
  const { data: contest } = useContest(4)

  const { signAndVerify, ...status } = useSignatureVerification(4)

  console.log(status)

  const sign = useCallback(async () => {
    await signAndVerify()
  }, [signAndVerify])

  if (!contest) return <Text>"Loading..."</Text>

  return (
    <Box shadow={false} fullWidth className={styles.container}>
      <Row spacing="xl">
        <Column>
          <img src={aaveLogo} width={100} height={100} alt="AAVE" />
        </Column>
        <Column grow={1} spacing="xl">
          <Row>
            <Column spacing="s">
              <Title variant="h1">{contest.title}</Title>
              <Text>{contest?.shortDescription}</Text>
            </Column>
          </Row>
          <Row>
            <Text variant="normal">{contest.description}</Text>
          </Row>
        </Column>
        <Column grow={0.2} spacing="xl">
          <Row>
            <Column>
              <Title variant="h3">PRIZE POOL</Title>
              <Text size="extra-large" strong>
                {commify(contest.prizePool)} USDC
              </Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Title variant="h3">STARTED</Title>
              <Text size="extra-large" strong>
                {DateTime.fromSeconds(contest.startDate).toLocaleString(DateTime.DATE_MED)}
              </Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Title variant="h3">ENDS IN</Title>
              <Text size="extra-large" strong>
                5 days 4 hours
              </Text>
            </Column>
          </Row>
          <Row>
            <Button onClick={sign}>SIGN UP</Button>
          </Row>
        </Column>
      </Row>
    </Box>
  )
}
