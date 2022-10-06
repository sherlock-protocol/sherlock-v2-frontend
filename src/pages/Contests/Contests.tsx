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

export const ContestsPage: React.FC<{}> = () => {
  const { data: contests } = useContests()
  const { signUp, isLoading, isSuccess: signUpSuccess, auditor } = useSignUp()
  const navigate = useNavigate()
  const [signUpFormModalOpen, setSignUpFormModalOpen] = useState(false)
  const [signUpSuccessModalOpen, setSignUpSuccessModalOpen] = useState(false)

  const handleContestClick = useCallback(
    (id: number) => {
      navigate(`${id}`)
    },
    [navigate]
  )

  console.log(signUpSuccess, auditor)

  useEffect(() => {
    if (signUpSuccess) {
      setSignUpSuccessModalOpen(true)
      setSignUpFormModalOpen(false)
    }
  }, [signUpSuccess])

  return (
    <Column spacing="m" className={styles.container}>
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

      <ActiveContests contests={contests} onContestClick={handleContestClick} />
      <UpcomingContests contests={contests} onContestClick={handleContestClick} />
      <FinishedContests contests={contests} onContestClick={handleContestClick} />
      {signUpSuccessModalOpen && auditor && (
        <SignUpSuccessModal auditor={auditor} onClose={() => setSignUpSuccessModalOpen(false)} />
      )}
    </Column>
  )
}
