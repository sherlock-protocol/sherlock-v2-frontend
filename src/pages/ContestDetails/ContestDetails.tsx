import { useCallback, useEffect, useMemo, useState } from "react"
import { DateTime } from "luxon"
import { useAccount } from "wagmi"
import { useNavigate, useParams } from "react-router-dom"
import { FaGithub, FaBook, FaClock, FaUsers, FaCrown, FaTrophy, FaLock } from "react-icons/fa"

import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Button } from "../../components/Button"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"
import { commify } from "../../utils/units"
import { useContest, useContestant, useOptInOut } from "../../hooks/api/contests"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { SignUpSuccessModal } from "./SignUpSuccessModal"

import styles from "./ContestDetails.module.scss"
import { ErrorModal } from "./ErrorModal"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import Options from "../../components/Options/Options"
import { Markdown } from "../../components/Markdown/Markdown"
import { ReportModal } from "./ReportModal"

import { timeLeftString } from "../../utils/dates"
import { useProfile } from "../../hooks/api/auditors/useProfile"
import { useJoinContest } from "../../hooks/api/auditors/useJoinContest"
import { JoinContestModal } from "./JoinContestModal"
import { AuditorSignUpModal } from "../Contests/AuditorSignUpModal"
import { useIsAuditor } from "../../hooks/api/auditors"
import { useAuthentication } from "../../hooks/api/useAuthentication"
import { ContestLeaderboardModal } from "./ContestLeaderboardModal"
import { useContestLeaderboard } from "../../hooks/api/contests/useContestLeaderboard"

const STATUS_LABELS = {
  CREATED: "UPCOMING",
  RUNNING: "RUNNING",
  JUDGING: "JUDGING",
  FINISHED: "FINISHED",
  ESCALATING: "ESCALATIONS OPEN",
  SHERLOCK_JUDGING: "JUDGING",
}

export const ContestDetails = () => {
  const navigate = useNavigate()
  const { contestId } = useParams()
  const { address } = useAccount()
  const { data: profile } = useProfile()
  const { data: isAuditor } = useIsAuditor(address)
  const { authenticate, isLoading: authenticationIsLoading } = useAuthentication()

  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [joinContestModalOpen, setJoinContestModalOpen] = useState(false)
  const [signUpModalOpen, setSignUpModalOpen] = useState(false)
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false)

  const { data: contest } = useContest(parseInt(contestId ?? ""))
  const { data: contestant } = useContestant(address ?? "", parseInt(contestId ?? ""), {
    enabled: !!address,
    retry: false,
  })
  const [optIn, setOptIn] = useState(contestant?.countsTowardsRanking ?? true)

  const {
    joinContest,
    isLoading: joinContestIsLoading,
    isSuccess: joinContestSuccess,
    data: joinContestData,
    reset: resetJoinContest,
    isError,
    error,
  } = useJoinContest(parseInt(contestId ?? ""))

  const { signAndOptIn, isLoading: optInisLoading } = useOptInOut(
    parseInt(contestId ?? ""),
    !!!contestant?.countsTowardsRanking,
    contestant?.handle ?? ""
  )

  const { data: contestLeaderboard } = useContestLeaderboard(parseInt(contestId ?? ""))

  useEffect(() => {
    if (joinContestSuccess) {
      setSuccessModalOpen(true)
    }
  }, [joinContestSuccess])

  useEffect(() => {
    if (contestant?.countsTowardsRanking !== undefined) {
      setOptIn(contestant.countsTowardsRanking)
    }
  }, [contestant?.countsTowardsRanking])

  const handleJoinContest = useCallback(() => {
    if (!profile) return

    // If the auditor is also a team admin, we give them the option to join the contest as a team.
    if (profile.managedTeams.length > 0) {
      setJoinContestModalOpen(true)
    } else {
      joinContest(profile.handle)
    }
  }, [joinContest, profile])

  const handleJoinContestWithHandle = useCallback(
    (handle: string) => {
      joinContest(handle)
      setJoinContestModalOpen(false)
    },
    [joinContest]
  )

  const handleSignUp = useCallback(() => {
    setSignUpModalOpen(true)
  }, [setSignUpModalOpen])

  const handleSignUpModalClose = useCallback(() => {
    setSignUpModalOpen(false)
  }, [setSignUpModalOpen])

  const handleSignIn = useCallback(() => {
    authenticate()
  }, [authenticate])

  const visitRepo = useCallback(() => {
    contestant && window.open(`https://github.com/${contestant.repo}`, "__blank")
  }, [contestant])

  const handleReportClick = useCallback(() => {
    setReportModalOpen(true)
  }, [setReportModalOpen])

  const handleLeaderboardClick = useCallback(() => {
    setLeaderboardModalOpen(true)
  }, [setLeaderboardModalOpen])

  const handleOptInChange = useCallback(
    (_optIn: boolean) => {
      if (_optIn !== contestant?.countsTowardsRanking) {
        signAndOptIn()
      }
    },
    [signAndOptIn, contestant?.countsTowardsRanking]
  )

  const handleErrorModalClose = useCallback(() => {
    resetJoinContest()
  }, [resetJoinContest])

  const handleLeaderboardModalClose = useCallback(() => {
    setLeaderboardModalOpen(false)
  }, [setLeaderboardModalOpen])

  const canOptinOut = useMemo(
    () => !contest?.private && (contest?.status === "CREATED" || contest?.status === "RUNNING"),
    [contest?.status, contest?.private]
  )

  const joinContestEnabled = useMemo(
    () => contest?.status === "CREATED" || (contest?.status === "RUNNING" && !contest.private),
    [contest?.status, contest?.private]
  )

  if (!contest) return null

  const startDate = DateTime.fromSeconds(contest.startDate)
  const endDate = DateTime.fromSeconds(contest.endDate)

  const timeLeft = endDate.diffNow(["day", "hour", "minute", "second"])
  const endingSoon = contest.status === "RUNNING" && timeLeft.days < 2

  const profileIsComplete = profile && profile.githubHandle && profile.discordHandle

  const hasEnoughAuditDays = profile && profile.auditDays > 28

  return (
    <Column spacing="m" className={styles.container}>
      {!isAuditor && (
        <Box shadow={false}>
          <Row spacing="xl" alignment={["start", "center"]}>
            <Title variant="h2">Not a Watson yet?</Title>
            <ConnectGate>
              <Button onClick={handleSignUp}>Sign up</Button>
            </ConnectGate>
          </Row>
        </Box>
      )}
      <Box shadow={false} fullWidth>
        <LoadingContainer
          loading={authenticationIsLoading || joinContestIsLoading || optInisLoading}
          label={"Loading..."}
        >
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
              <Column alignment={["center", "center"]} grow={1}>
                {contest.private ? (
                  <Row alignment={["center", "center"]}>
                    <Column alignment="center" spacing="m">
                      <Text variant="secondary" strong>
                        <FaLock />
                        &nbsp; PRIVATE CONTEST
                      </Text>
                      <Text variant="secondary">The details of this contest are hidden</Text>
                    </Column>
                  </Row>
                ) : (
                  <Markdown content={contest.description} />
                )}
              </Column>
            </Column>
            <Column spacing="xl" shrink={0} className={styles.sidebar}>
              <Row>
                <Text>Status:</Text>&nbsp;
                <Text strong>{STATUS_LABELS[contest.status]}</Text>
              </Row>
              {endingSoon && (
                <Row spacing="xs">
                  <Text variant="alternate">
                    <FaClock />
                  </Text>
                  <Text variant="alternate" strong>{`Time left: ${timeLeftString(timeLeft)}`}</Text>
                </Row>
              )}
              {contest.status === "FINISHED" && contest.report && (
                <Button variant="secondary" onClick={handleReportClick}>
                  <FaBook /> &nbsp; Read report
                </Button>
              )}
              {contestLeaderboard && contestLeaderboard.contestants.length > 0 && (
                <Button variant="secondary" onClick={handleLeaderboardClick}>
                  <FaTrophy /> &nbsp; View Leaderboard
                </Button>
              )}
              <hr />
              <Row>
                <Column spacing="l">
                  <Row>
                    <Column>
                      <Title variant="h3">TOTAL REWARDS</Title>
                      <Text size="extra-large" strong>
                        {`${commify(contest.prizePool + contest.leadSeniorAuditorFixedPay)} USDC`}
                      </Text>
                    </Column>
                  </Row>
                  <Row spacing="l">
                    <Column>
                      <Title variant="h4">Contest Pool</Title>
                      <Text strong>{`${commify(contest.prizePool)} USDC`}</Text>
                    </Column>
                    <Column>
                      <Title variant="h4">Lead Senior Watson</Title>
                      <Text strong>{`${commify(contest.leadSeniorAuditorFixedPay)} USDC`}</Text>
                    </Column>
                  </Row>
                </Column>
              </Row>
              <hr />
              <Row spacing="s" alignment={["start", "center"]}>
                <FaCrown title="Lead Senior Watson" />
                <Text strong>{contest.leadSeniorAuditorHandle ?? "TBD"}</Text>
              </Row>
              <hr />
              <Row>
                <Column>
                  <Title variant="h3">{contest.status === "CREATED" ? "STARTS" : "STARTED"}</Title>
                  <Row alignment={["center", "center"]} spacing="s">
                    <Text size="extra-large" strong>
                      {startDate.toLocaleString(DateTime.DATE_MED)}
                    </Text>
                    <Text size="small">
                      {`${startDate.toLocaleString(DateTime.TIME_24_SIMPLE)} ${endDate.offsetNameShort}`}
                    </Text>
                  </Row>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text size="normal" strong variant={endingSoon ? "alternate" : "normal"}>
                    {contest.status === "FINISHED" || contest.status === "JUDGING" ? "ENDED" : "ENDS"}
                  </Text>
                  <Row alignment={["center", "center"]} spacing="s">
                    <Text size="extra-large" strong variant={endingSoon ? "alternate" : "normal"}>
                      {endDate.toLocaleString(DateTime.DATE_MED)}
                    </Text>
                    <Text size="small" variant={endingSoon ? "alternate" : "normal"}>
                      {`${endDate.toLocaleString(DateTime.TIME_24_SIMPLE)} ${endDate.offsetNameShort}`}
                    </Text>
                  </Row>
                </Column>
              </Row>
              <hr />
              {contest.private && (
                <>
                  <Row>
                    <Column spacing="m">
                      <Row spacing="xs">
                        <Text variant="alternate" size="small" strong>
                          <FaLock />
                          &nbsp; PRIVATE CONTEST
                        </Text>
                      </Row>
                      <Text variant="secondary" size="small">
                        This is a private contest. Every Watson with more than 28 contest days can join but only the top
                        10 will be selected to participate.
                      </Text>
                      <Text variant="secondary" size="small">
                        Every participant is forced to compete for USDC+Points.
                      </Text>
                    </Column>
                  </Row>
                  <hr />
                </>
              )}
              {profile && (
                <Row>
                  {contestant ? (
                    <Column spacing="m" grow={1}>
                      {contest.private ? (
                        contestant.repo ? (
                          <>
                            <Row spacing="xs">
                              <Text>Joined contest as</Text>
                              {contestant.isTeam && <FaUsers title="Team" />}
                              <Text strong>{contestant.handle}</Text>
                            </Row>
                            <Button variant="secondary" onClick={visitRepo}>
                              <FaGithub /> &nbsp; View repository
                            </Button>
                          </>
                        ) : contest.status === "CREATED" ? (
                          <>
                            <Row spacing="xs">
                              <Text>Joined contest as</Text>
                              {contestant.isTeam && <FaUsers title="Team" />}
                              <Text strong>{contestant.handle}</Text>
                            </Row>
                            <Row>
                              <Text variant="secondary">
                                The top 10 Watsons will receive an invitation to their private repos once the contest
                                starts
                              </Text>
                            </Row>
                          </>
                        ) : (
                          <>
                            <Row>
                              <Text>You were not selected to participate in this contest.</Text>
                            </Row>
                          </>
                        )
                      ) : (
                        <>
                          <Row spacing="xs">
                            <Text>Joined contest as</Text>
                            {contestant.isTeam && <FaUsers title="Team" />}
                            <Text strong>{contestant.handle}</Text>
                          </Row>
                          <Button variant="secondary" onClick={visitRepo} disabled={!contestant.repo}>
                            <FaGithub /> &nbsp; View repository
                          </Button>
                          {!contestant.repo && (
                            <Text size="small" variant="secondary">
                              Repository will be available once the contest starts
                            </Text>
                          )}
                        </>
                      )}

                      {!contest.private && (
                        <>
                          <Text>
                            {contest.status === "CREATED" || contest.status === "RUNNING"
                              ? "You're competing for:"
                              : "You've competed for:"}
                          </Text>
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
                        </>
                      )}
                    </Column>
                  ) : joinContestEnabled ? (
                    profileIsComplete ? (
                      <Column spacing="m">
                        <ConnectGate>
                          <Button onClick={handleJoinContest} disabled={contest.private && !hasEnoughAuditDays}>
                            JOIN CONTEST
                          </Button>
                        </ConnectGate>
                        {contest.private && !hasEnoughAuditDays && (
                          <Text variant="secondary" size="small">
                            You need to reach at least 28 contest days to compete in this contest.
                          </Text>
                        )}
                      </Column>
                    ) : (
                      <Column spacing="m">
                        <Text variant="secondary" size="small">
                          Before joining a contest, you need to fill in your profile details.
                        </Text>
                        <Button onClick={() => navigate("../profile")}>Complete Profile</Button>
                      </Column>
                    )
                  ) : null}
                </Row>
              )}
              {!profile && isAuditor && (
                <Row>
                  <ConnectGate>
                    <Button onClick={handleSignIn}>SIGN IN</Button>
                  </ConnectGate>
                </Row>
              )}
            </Column>
          </Row>
          {successModalOpen && (
            <SignUpSuccessModal
              onClose={() => setSuccessModalOpen(false)}
              contest={contest}
              repo={joinContestData?.repoName}
            />
          )}
          {isError && <ErrorModal reason={error?.fieldErrors || error?.message} onClose={handleErrorModalClose} />}
          {reportModalOpen && (
            <ReportModal report={contest.report} contest={contest} onClose={() => setReportModalOpen(false)} />
          )}
          {joinContestModalOpen && (
            <JoinContestModal
              contest={contest}
              auditor={profile!!}
              onClose={() => setJoinContestModalOpen(false)}
              onSelectHandle={handleJoinContestWithHandle}
            />
          )}
          {signUpModalOpen && <AuditorSignUpModal closeable onClose={handleSignUpModalClose} />}
          {leaderboardModalOpen && (
            <ContestLeaderboardModal contestID={contest.id} onClose={handleLeaderboardModalClose} />
          )}
        </LoadingContainer>
      </Box>
    </Column>
  )
}
