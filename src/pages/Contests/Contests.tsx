import React, { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button"

import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { useSignUp } from "../../hooks/api/auditors/useSignUp"
import { useContests } from "../../hooks/api/contests"
import { SignUpSuccessModal } from "./SignUpSuccessModal"
import { ActiveContests } from "./ActiveContests"
import { AuditorSignUpModal } from "./AuditorSignUpModal"

import styles from "./Contests.module.scss"
import { FinishedContests } from "./FinishedContests"
import { UpcomingContests } from "./UpcomingContests"
import { useIsAuditor } from "../../hooks/api/auditors"
import { useAccount } from "wagmi"
import { ErrorModal } from "../ContestDetails/ErrorModal"

export const ContestsPage: React.FC<{}> = () => {
  const { address: connectedAddress } = useAccount()
  const { data: contests } = useContests()
  const {
    signUp,
    isLoading,
    isSuccess: signUpSuccess,
    auditor,
    error: signupError,
    isError: isSignupError,
    reset: resetSignup,
  } = useSignUp()
  const { data: isAuditor } = useIsAuditor(connectedAddress)
  const navigate = useNavigate()
  const [signUpFormModalOpen, setSignUpFormModalOpen] = useState(false)
  const [signUpSuccessModalOpen, setSignUpSuccessModalOpen] = useState(false)
  const [signUpErrorModalOpen, setSignUpErrorModalOpen] = useState(false)

  useEffect(() => {
    if (signUpSuccess) {
      setSignUpSuccessModalOpen(true)
      setSignUpFormModalOpen(false)
    }
  }, [signUpSuccess])

  useEffect(() => {
    if (isSignupError && signupError) {
      setSignUpErrorModalOpen(true)
    }
  }, [isSignupError, signupError, setSignUpErrorModalOpen])

  const handleContestClick = useCallback(
    (id: number) => {
      navigate(`${id}`)
    },
    [navigate]
  )

  const handleErrorModalClose = useCallback(() => {
    setSignUpErrorModalOpen(false)
    resetSignup()
  }, [setSignUpErrorModalOpen, resetSignup])

  return (
    <Column spacing="m" className={styles.container}>
      {!isAuditor && (
        <Box shadow={false}>
          <Row alignment={["space-between", "center"]}>
            <Title variant="h2">Want to become an auditor?</Title>
            <Button onClick={() => setSignUpFormModalOpen(true)}>Sign up</Button>
          </Row>
          {signUpFormModalOpen && (
            <AuditorSignUpModal
              onSubmit={signUp}
              isLoading={isLoading}
              closeable
              onClose={() => setSignUpFormModalOpen(false)}
            />
          )}
        </Box>
      )}

      <ActiveContests contests={contests} onContestClick={handleContestClick} />
      <UpcomingContests contests={contests} onContestClick={handleContestClick} />
      <FinishedContests contests={contests} onContestClick={handleContestClick} />
      {signUpSuccessModalOpen && auditor && (
        <SignUpSuccessModal auditor={auditor} onClose={() => setSignUpSuccessModalOpen(false)} />
      )}
      {signUpErrorModalOpen && (
        <ErrorModal reason={signupError?.fieldErrors ?? signupError?.message} onClose={handleErrorModalClose} />
      )}
    </Column>
  )
}
