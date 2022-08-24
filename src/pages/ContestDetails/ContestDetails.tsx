import React, { useCallback, useEffect, useMemo, useState } from "react"
import { DateTime } from "luxon"

import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Button } from "../../components/Button"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"
import { commify } from "../../utils/units"
import { useContest, useContestSignUp, useSignatureVerification } from "../../hooks/api/contests"

import aaveLogo from "../../assets/icons/aave-logo.png"
import styles from "./ContestDetails.module.scss"
import { AuditorFormModal } from "./AuditorFormModal"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { SignUpSuccessModal } from "./SignUpSuccessModal"

export const ContestDetails = () => {
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [auditorFormOpen, setAuditorFormOpen] = useState(false)
  const { data: contest } = useContest(4)
  const {
    signAndVerify,
    data: auditor,
    isFetched: auditorIsFetched,
    signature,
    isLoading: signatureIsLoading,
  } = useSignatureVerification(4)

  const shouldDisplayAuditorForm = useMemo(
    () => auditorIsFetched && (!auditor || !auditor.discordHandle || !auditor.githubHandle),
    [auditor, auditorIsFetched]
  )

  const auditorProfileIsComplete = useMemo(
    () => auditorIsFetched && auditor && auditor.discordHandle && auditor.githubHandle,
    [auditorIsFetched, auditor]
  )

  const {
    mutate: doSignUp,
    isLoading: signUpIsLoading,
    isSuccess: signUpSuccess,
  } = useContestSignUp({
    handle: auditor?.handle ?? "",
    githubHandle: auditor?.githubHandle,
    discordHandle: auditor?.discordHandle,
    contestId: contest?.id ?? 0,
    signature: signature ?? "",
  })

  useEffect(() => {
    if (auditorProfileIsComplete) {
      doSignUp()
    }
  }, [auditorProfileIsComplete, doSignUp])

  useEffect(() => {
    if (signUpSuccess) {
      setSuccessModalOpen(true)
    }
  }, [signUpSuccess])

  useEffect(() => {
    if (shouldDisplayAuditorForm) {
      setAuditorFormOpen(true)
    }
  }, [shouldDisplayAuditorForm])

  const sign = useCallback(async () => {
    await signAndVerify()
  }, [signAndVerify])

  if (!contest) return <Text>"Loading..."</Text>

  return (
    <Box shadow={false} fullWidth className={styles.container}>
      <LoadingContainer loading={signatureIsLoading || signUpIsLoading} label={"Signing up..."}>
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
                <Title variant="h3">ENDS</Title>
                <Text size="extra-large" strong>
                  {DateTime.fromSeconds(contest.endDate).toLocaleString(DateTime.DATE_MED)}
                </Text>
              </Column>
            </Row>
            <Row>
              <Button onClick={sign}>SIGN UP</Button>
            </Row>
          </Column>
        </Row>
        {auditorFormOpen && (
          <AuditorFormModal
            onClose={() => setAuditorFormOpen(false)}
            contest={contest}
            auditor={auditor}
            signature={signature ?? ""}
          />
        )}
        {successModalOpen && <SignUpSuccessModal onClose={() => setSuccessModalOpen(false)} contest={contest} />}
      </LoadingContainer>
    </Box>
  )
}
