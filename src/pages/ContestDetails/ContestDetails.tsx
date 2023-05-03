import { useCallback, useEffect, useMemo, useState } from "react"
import { DateTime } from "luxon"
import { useAccount } from "wagmi"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { FaGithub, FaBook, FaClock, FaUsers, FaCrown, FaTrophy, FaLock, FaGavel } from "react-icons/fa"

import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Button } from "../../components/Button"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"
import { commify } from "../../utils/units"
import { useContest, useOptInOut } from "../../hooks/api/contests"
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
import { useContestant } from "../../hooks/api/contests/useContestant"
import { useContestLeaderboard } from "../../hooks/api/stats/leaderboard/useContestLeaderboard"
import { contestsRoutes } from "../../utils/routes"

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
  const [joinJudgingContestModalOpen, setJoinJudgingContestModalOpen] = useState(false)
  const [signUpModalOpen, setSignUpModalOpen] = useState(false)
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false)

  const { data: contest, isError: isContestError } = useContest(parseInt(contestId ?? ""))
  const { data: contestant } = useContestant(address ?? "", parseInt(contestId ?? ""), {
    enabled: !!address,
    retry: false,
  })
  const [optIn, setOptIn] = useState(contestant?.audit?.countsTowardsRanking ?? true)

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
    !!!contestant?.audit?.countsTowardsRanking,
    contestant?.audit?.handle ?? ""
  )

  const { data: contestLeaderboard } = useContestLeaderboard(parseInt(contestId ?? ""))

  useEffect(() => {
    if (joinContestSuccess) {
      setSuccessModalOpen(true)
    }
  }, [joinContestSuccess])

  useEffect(() => {
    if (contestant?.audit?.countsTowardsRanking !== undefined) {
      setOptIn(contestant.audit.countsTowardsRanking)
    }
  }, [contestant?.audit?.countsTowardsRanking])

  const handleJoinContest = useCallback(() => {
    if (!profile) return

    // If the auditor is also a team admin, we give them the option to join the contest as a team.
    if (profile.managedTeams.length > 0) {
      setJoinContestModalOpen(true)
    } else {
      joinContest(profile.handle)
    }
  }, [joinContest, profile])

  const handleJoinJudgingContest = useCallback(() => {
    if (!profile) return

    // If the auditor is also a team admin, we give them the option to join the contest as a team.
    if (profile.managedTeams.length > 0) {
      setJoinJudgingContestModalOpen(true)
    } else {
      joinContest(profile.handle, true)
    }
  }, [joinContest, profile])

  const handleJoinContestWithHandle = useCallback(
    (handle: string) => {
      joinContest(handle)
      setJoinContestModalOpen(false)
    },
    [joinContest]
  )

  const handleJoinJudgingContestWithHandle = useCallback(
    (handle: string) => {
      joinContest(handle, true)
      setJoinJudgingContestModalOpen(false)
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
    contestant?.audit && window.open(`https://github.com/${contestant.audit.repo}`, "__blank")
  }, [contestant])

  const visitJudgingRepo = useCallback(() => {
    contestant?.judging && window.open(`https://github.com/${contestant.judging.repo}`, "__blank")
  }, [contestant])

  const handleReportClick = useCallback(() => {
    setReportModalOpen(true)
  }, [setReportModalOpen])

  const handleJudgingRepoClick = useCallback(() => {
    contest?.judgingRepo && window.open(`https://github.com/${contest.judgingRepo}/issues`, "__blank")
  }, [contest])

  const handleLeaderboardClick = useCallback(() => {
    setLeaderboardModalOpen(true)
  }, [setLeaderboardModalOpen])

  const handleOptInChange = useCallback(
    (_optIn: boolean) => {
      if (_optIn !== contestant?.audit?.countsTowardsRanking) {
        signAndOptIn()
      }
    },
    [signAndOptIn, contestant?.audit?.countsTowardsRanking]
  )

  const handleErrorModalClose = useCallback(() => {
    resetJoinContest()
  }, [resetJoinContest])

  const handleLeaderboardModalClose = useCallback(() => {
    setLeaderboardModalOpen(false)
  }, [setLeaderboardModalOpen])

  const canOptinOut = useMemo(
    () => contest?.id !== 63 && !contest?.private && (contest?.status === "CREATED" || contest?.status === "RUNNING"),
    [contest?.status, contest?.private, contest?.id]
  )

  const joinContestEnabled = useMemo(
    () => contest?.status === "CREATED" || (contest?.status === "RUNNING" && !contest.private),
    [contest?.status, contest?.private]
  )
  const canJoinJudging = useMemo(
    () =>
      contest?.status !== "FINISHED" &&
      contest?.status !== "ESCALATING" &&
      contest?.status !== "SHERLOCK_JUDGING" &&
      !contest?.private &&
      !!contest?.judgingPrizePool &&
      contest.judgingPrizePool > 0,
    [contest?.status, contest?.private, contest?.judgingPrizePool]
  )

  if (isContestError) return <Navigate replace to={contestsRoutes.Contests} />
  if (!contest) return null

  const startDate = DateTime.fromSeconds(contest.startDate)
  const endDate = DateTime.fromSeconds(contest.endDate)

  const timeLeft = endDate.diffNow(["day", "hour", "minute", "second"])
  const endingSoon = contest.status === "RUNNING" && timeLeft.days < 2

  const profileIsComplete = profile && profile.githubHandle

  const hasEnoughAuditDays = profile && profile.auditDays >= 28

  const canViewFindings =
    !contest.private &&
    (!["CREATED", "RUNNING"].includes(contest.status) ||
      (contest.status === "SHERLOCK_JUDGING" && contest.escalationStartDate))

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
              {canViewFindings && (
                <Button variant="secondary" onClick={handleJudgingRepoClick}>
                  <FaGithub /> &nbsp; View findings
                </Button>
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
                    <Column spacing="s">
                      <Column>
                        <Title variant="h3">TOTAL REWARDS</Title>
                        <Row spacing="xs" alignment={["start", "baseline"]}>
                          <Text size="extra-large" strong>
                            {contest.id === 38 || contest.id === 63
                              ? `$${commify(contest.rewards)}`
                              : `${commify(contest.rewards)} USDC`}
                          </Text>
                        </Row>
                      </Column>
                    </Column>
                  </Row>
                  <Row spacing="m">
                    <Column spacing="s">
                      <Text variant="secondary" strong>
                        Contest Pool
                      </Text>
                      <Text variant="secondary" strong>
                        Lead Senior Watson
                      </Text>
                      {contest.judgingPrizePool ? (
                        <Text variant="secondary" strong>
                          Judging Pool
                        </Text>
                      ) : null}
                      {contest.leadJudgeFixedPay ? (
                        <Text variant="secondary" strong>
                          Lead Judge
                        </Text>
                      ) : null}
                    </Column>
                    <Column spacing="s" alignment="end">
                      <Text variant="secondary" strong>
                        {`${contest.id === 38 || contest.id === 63 ? "$" : ""}${commify(contest.prizePool)} ${
                          contest.id !== 38 && contest.id !== 63 ? "USDC" : "(*)"
                        }`}
                      </Text>
                      <Text variant="secondary" strong>{`${commify(contest.leadSeniorAuditorFixedPay)} USDC`}</Text>
                      {contest.judgingPrizePool ? (
                        <Text variant="secondary" strong>{`${
                          contest.id === 38 || contest.id === 63 ? "$" : ""
                        }${commify(contest.judgingPrizePool)} ${
                          contest.id !== 38 && contest.id !== 63 ? "USDC" : ""
                        }`}</Text>
                      ) : null}
                      {contest.leadJudgeFixedPay ? (
                        <Text variant="secondary" strong>{`${commify(contest.leadJudgeFixedPay)} USDC`}</Text>
                      ) : null}
                    </Column>
                  </Row>
                  {contest.id === 38 && (
                    <Text variant="secondary" size="small">
                      (*) &#8531; USDC and &#8532; OP tokens
                    </Text>
                  )}
                  {contest.id === 63 && (
                    <Text variant="secondary" size="small">
                      (*) $70k paid in OP tokens, $50k in USDC
                    </Text>
                  )}
                </Column>
              </Row>
              <hr />
              <Column spacing="m">
                <Column spacing="xs">
                  <Text variant="alternate" size="small" strong>
                    LEAD SENIOR WATSON
                  </Text>
                  <Row spacing="s" alignment={["start", "center"]}>
                    <FaCrown title="Lead Senior Watson" />
                    {contest.id === 38 || contest.id === 63 ? (
                      <Text strong>obront + Trust</Text>
                    ) : (
                      <Text strong>{contest.leadSeniorAuditorHandle ?? "TBD"}</Text>
                    )}
                  </Row>
                </Column>
                <Column spacing="xs">
                  {contest.judgingPrizePool ? (
                    <>
                      <Text variant="alternate" size="small" strong>
                        LEAD JUDGE
                      </Text>
                      <Row spacing="s" alignment={["start", "center"]}>
                        <FaGavel title="Lead Judge" />
                        <Text strong>{contest.leadJudgeHandle ?? "TBD"}</Text>
                      </Row>
                    </>
                  ) : null}
                </Column>
              </Column>
              <hr />
              <Row>
                <Column>
                  <Title variant="h3">{contest.status === "CREATED" ? "STARTS" : "STARTED"}</Title>
                  <Row spacing="s">
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
                    <Text size="small">
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
                <>
                  {contestant?.audit ? (
                    <Column spacing="m" grow={0}>
                      {contest.private ? (
                        contestant.audit.repo ? (
                          <>
                            <Row spacing="xs">
                              <Text>Joined contest as</Text>
                              {contestant.audit.isTeam && <FaUsers title="Team" />}
                              <Text strong>{contestant.audit.handle}</Text>
                            </Row>
                            <Button variant="secondary" onClick={visitRepo}>
                              <FaGithub /> &nbsp; View repository
                            </Button>
                          </>
                        ) : contest.status === "CREATED" ? (
                          <>
                            <Row spacing="xs">
                              <Text>Joined contest as</Text>
                              {contestant.audit.isTeam && <FaUsers title="Team" />}
                              <Text strong>{contestant.audit.handle}</Text>
                            </Row>
                            <Row>
                              <Text variant="secondary">
                                The top 10 Watsons will receive an invitation to their private repos once the contest
                                starts.
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
                            {contestant.audit.isTeam && <FaUsers title="Team" />}
                            <Text strong>{contestant.audit.handle}</Text>
                          </Row>
                          <Button variant="secondary" onClick={visitRepo} disabled={!contestant.audit.repo}>
                            <FaGithub /> &nbsp; View repository
                          </Button>
                          {!contestant.audit.repo && (
                            <Text size="small" variant="secondary">
                              Repository will be available once the contest starts
                            </Text>
                          )}
                        </>
                      )}

                      {!contest.private && (
                        <Column spacing="xs">
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
                        </Column>
                      )}
                    </Column>
                  ) : joinContestEnabled ? (
                    profileIsComplete ? (
                      <Column spacing="m">
                        <ConnectGate>
                          <Button onClick={handleJoinContest} disabled={contest.private && !hasEnoughAuditDays}>
                            Join Audit Contest
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
                  {contestant?.judging ? (
                    <>
                      <Row>
                        <Column spacing="m" grow={1}>
                          <Row spacing="xs">
                            <Text>Joined judging as</Text>
                            {contestant.judging.isTeam && <FaUsers title="Team" />}
                            <Text strong>{contestant.judging.handle}</Text>
                          </Row>

                          <Button variant="secondary" onClick={visitJudgingRepo} disabled={!contestant.judging.repo}>
                            <FaGithub /> &nbsp; View judging repository
                          </Button>
                          {!contestant.judging.repo && (
                            <Text size="small" variant="secondary">
                              Repository will be available once the judging phase starts
                            </Text>
                          )}
                        </Column>
                      </Row>
                      <hr />
                    </>
                  ) : canJoinJudging ? (
                    profileIsComplete ? (
                      <>
                        <Row>
                          <Column spacing="s" grow={1}>
                            {contest.status !== "JUDGING" && (
                              <Text size="small" variant="secondary">
                                The judging contest starts as soon as the audit contest ends.
                              </Text>
                            )}
                            {contest.status === "JUDGING" && !contestant?.audit && (
                              <Button
                                variant="secondary"
                                onClick={() => window.open(`https://github.com/${contest.repo}`)}
                              >
                                <FaGithub />
                                &nbsp;Audit repository
                              </Button>
                            )}
                            <Button variant="alternate" onClick={handleJoinJudgingContest}>
                              Judge Contest
                            </Button>
                          </Column>
                        </Row>
                      </>
                    ) : (
                      <Column spacing="m">
                        <Text variant="secondary" size="small">
                          Before joining a contest, you need to fill in your profile details
                        </Text>
                        <Button onClick={() => navigate("../profile")}>Complete Profile</Button>
                      </Column>
                    )
                  ) : null}
                </>
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
              judging={joinContestData?.judging}
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
          {joinJudgingContestModalOpen && (
            <JoinContestModal
              contest={contest}
              auditor={profile!!}
              onClose={() => setJoinJudgingContestModalOpen(false)}
              onSelectHandle={handleJoinJudgingContestWithHandle}
              judging
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
