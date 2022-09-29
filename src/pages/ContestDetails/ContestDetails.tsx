import React, { useCallback, useEffect, useMemo, useState } from "react"
import { DateTime } from "luxon"
import { useAccount } from "wagmi"
import { useParams } from "react-router-dom"
import { FaGithub, FaBook } from "react-icons/fa"

import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Button } from "../../components/Button"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"
import { commify } from "../../utils/units"
import { useContest, useContestant, useOptInOut } from "../../hooks/api/contests"
import { AuditorFormModal } from "./AuditorFormModal"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { SignUpSuccessModal } from "./SignUpSuccessModal"

import styles from "./ContestDetails.module.scss"
import { ErrorModal } from "./ErrorModal"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import Options from "../../components/Options/Options"
import { Markdown } from "../../components/Markdown/Markdown"
import { ReportModal } from "./ReportModal"

import { useSignUpSignatureVerification } from "../../hooks/api/contests/useSignUpSignatureVerification"
import { useContestSignUp } from "../../hooks/api/contests/useContestSignUp"

const STATUS_LABELS = {
  CREATED: "UPCOMING",
  RUNNING: "RUNNING",
  JUDGING: "JUDGING",
  FINISHED: "FINISHED",
}

type SignUpParams = {
  handle: string
  githubHandle: string
  discordHandle: string
  twitterHandle?: string
  telegramHandle?: string
  signature: string
  contestId: number
}

export const ContestDetails = () => {
  const { contestId } = useParams()
  const { address } = useAccount()
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [auditorFormOpen, setAuditorFormOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)

  const { data: contest } = useContest(parseInt(contestId ?? ""))
  const { data: contestant } = useContestant(address ?? "", parseInt(contestId ?? ""), {
    enabled: !!address,
    retry: false,
  })
  const [optIn, setOptIn] = useState(contestant?.countsTowardsRanking ?? true)

  const {
    verifySignature,
    isLoading: signatureIsLoading,
    isSuccess: signatureVerificationSuccess,
    auditor: verifiedAuditor,
    signature,
    reset: resetSignatureVerification,
  } = useSignUpSignatureVerification(parseInt(contestId ?? ""))

  const { signAndOptIn, isLoading: optInisLoading } = useOptInOut(
    parseInt(contestId ?? ""),
    !!!contestant?.countsTowardsRanking
  )

  const {
    signUp,
    isLoading: signUpIsLoading,
    data: signUpData,
    error,
    isError,
    reset: resetSignUp,
    isSuccess: signUpSuccess,
  } = useContestSignUp()

  const signUpToContest = useCallback(
    async (params: SignUpParams) => {
      signUp(params)
    },
    [signUp]
  )

  useEffect(() => {
    resetSignatureVerification()
    resetSignUp()
  }, [address, resetSignatureVerification, resetSignUp])

  useEffect(() => {
    if (verifiedAuditor && verifiedAuditor.githubHandle && verifiedAuditor.discordHandle && signature && contestId) {
      signUpToContest({
        handle: verifiedAuditor.handle,
        githubHandle: verifiedAuditor.githubHandle,
        discordHandle: verifiedAuditor.discordHandle,
        twitterHandle: verifiedAuditor.twitterHandle,
        telegramHandle: verifiedAuditor.telegramHandle,
        signature: signature,
        contestId: parseInt(contestId),
      })
    }
  }, [signUpToContest, verifiedAuditor, signature, contestId])

  useEffect(() => {
    if (signUpSuccess) {
      setSuccessModalOpen(true)
      setAuditorFormOpen(false)
    }
  }, [signUpSuccess])

  useEffect(() => {
    if (contestant?.countsTowardsRanking !== undefined) {
      setOptIn(contestant.countsTowardsRanking)
    }
  }, [contestant?.countsTowardsRanking])

  useEffect(() => {
    if (
      signatureVerificationSuccess &&
      (!verifiedAuditor || !verifiedAuditor.githubHandle || !verifiedAuditor.discordHandle)
    ) {
      setAuditorFormOpen(true)
    }
  }, [verifiedAuditor, signatureVerificationSuccess])

  const sign = useCallback(() => {
    verifySignature()
  }, [verifySignature])

  const visitRepo = useCallback(async () => {
    contestant && window.open(`https://github.com/${contestant.repo}`, "__blank")
  }, [contestant])

  const handleReportClick = useCallback(async () => {
    setReportModalOpen(true)
  }, [setReportModalOpen])

  const handleOptInChange = useCallback(
    (_optIn: boolean) => {
      if (_optIn !== contestant?.countsTowardsRanking) {
        signAndOptIn()
      }
    },
    [signAndOptIn, contestant?.countsTowardsRanking]
  )

  const handleErrorModalClose = useCallback(() => {
    resetSignUp()
  }, [resetSignUp])

  const canOptinOut = useMemo(() => contest?.status === "CREATED" || contest?.status === "RUNNING", [contest?.status])
  const canSignUp = useMemo(() => contest?.status !== "FINISHED" && contest?.status !== "JUDGING", [contest?.status])

  if (!contest) return null

  const startDate = DateTime.fromSeconds(contest.startDate)
  const endDate = DateTime.fromSeconds(contest.endDate)

  return (
    <Column spacing="m" className={styles.container}>
      <Box shadow={false} fullWidth>
        <LoadingContainer loading={signatureIsLoading || signUpIsLoading || optInisLoading} label={"Loading..."}>
          <Row spacing="xl">
            <Column>
              <img src={contest.logoURL} width={80} height={80} alt={contest.title} className={styles.logo} />
            </Column>
            <Column grow={1} spacing="xl" className={styles.middle}>
              <Row>
                <Column spacing="s">
                  <Title variant="h1">{contest.title}</Title>
                  <Text alignment="justify">{contest?.shortDescription}</Text>
                </Column>
              </Row>
              <Column>
                <Markdown content={contest.description} />
              </Column>
            </Column>
            <Column spacing="xl" shrink={0} className={styles.sidebar}>
              <Row>
                <Text>Status:</Text>&nbsp;
                <Text strong>{STATUS_LABELS[contest.status]}</Text>
              </Row>
              {contest.status === "FINISHED" && contest.report && (
                <Button variant="secondary" onClick={handleReportClick}>
                  <FaBook /> &nbsp; Read report
                </Button>
              )}
              <hr />
              <Row>
                <Column>
                  <Title variant="h3">PRIZE POOL</Title>
                  <Text size="extra-large" strong>
                    {commify(contest.prizePool)} USDC
                  </Text>
                </Column>
              </Row>
              <hr />
              <Row>
                <Column>
                  <Title variant="h3">{contest.status === "CREATED" ? "STARTS" : "STARTED"}</Title>
                  <Row alignment={["center", "center"]} spacing="s">
                    <Text size="extra-large" strong>
                      {startDate.toLocaleString(DateTime.DATE_MED)}
                    </Text>
                    <Text size="small">{startDate.toLocaleString(DateTime.TIME_24_SIMPLE)}</Text>
                  </Row>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Title variant="h3">
                    {contest.status === "FINISHED" || contest.status === "JUDGING" ? "ENDED" : "ENDS"}
                  </Title>
                  <Row alignment={["center", "center"]} spacing="s">
                    <Text size="extra-large" strong>
                      {endDate.toLocaleString(DateTime.DATE_MED)}
                    </Text>
                    <Text size="small">{endDate.toLocaleString(DateTime.TIME_24_SIMPLE)}</Text>
                  </Row>
                </Column>
              </Row>
              <hr />
              <Row>
                {contestant ? (
                  <Column spacing="m" grow={1}>
                    <Text strong>Signed up</Text>

                    <Button variant="secondary" onClick={visitRepo} disabled={!contestant.repo}>
                      <FaGithub /> &nbsp; View repository
                    </Button>
                    {!contestant.repo && (
                      <Text size="small" variant="secondary">
                        Repository will be available once the contest starts
                      </Text>
                    )}

                    <Text>{canOptinOut ? "You're competing for:" : "You've competed for:"}</Text>
                    <Options
                      options={[
                        {
                          value: true,
                          label: "USDC + Points",
                        },
                        { value: false, label: "Only USDC" },
                      ]}
                      value={optIn}
                      onChange={handleOptInChange}
                      disabled={!canOptinOut}
                    />
                  </Column>
                ) : (
                  canSignUp && (
                    <ConnectGate>
                      <Button onClick={sign}>SIGN UP</Button>
                    </ConnectGate>
                  )
                )}
              </Row>
            </Column>
          </Row>
          {auditorFormOpen && (
            <AuditorFormModal
              onClose={() => setAuditorFormOpen(false)}
              onSubmit={(values) =>
                signUpToContest({
                  ...values,
                  contestId: parseInt(contestId!),
                  signature: signature!,
                })
              }
              contest={contest}
              auditor={verifiedAuditor}
              isLoading={signUpIsLoading}
            />
          )}
          {successModalOpen && (
            <SignUpSuccessModal onClose={() => setSuccessModalOpen(false)} contest={contest} repo={signUpData?.repo} />
          )}
          {isError && <ErrorModal reason={error?.fieldErrors ?? error?.message} onClose={handleErrorModalClose} />}
          {reportModalOpen && (
            <ReportModal report={contest.report} contest={contest} onClose={() => setReportModalOpen(false)} />
          )}
        </LoadingContainer>
      </Box>
    </Column>
  )
}
